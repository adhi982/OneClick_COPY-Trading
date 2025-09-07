module copy_trading::user_vault {
    use std::signer;
    use std::vector;
    use std::error;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::event;

    // Error codes
    const E_VAULT_NOT_EXISTS: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_VAULT_ALREADY_EXISTS: u64 = 4;
    const E_POSITION_NOT_FOUND: u64 = 5;
    const E_INVALID_VAULT_ID: u64 = 6;

    struct VaultInfo has key {
        owner: address,
        balance: u64,
        locked_balance: u64,
        positions: vector<Position>,
        daily_pnl: u64, // Changed from i64 to u64
        total_pnl: u64, // Changed from i64 to u64
        last_updated: u64,
    }

    struct Position has store, drop, copy {
        id: u64,
        trader_address: address,
        symbol: vector<u8>,
        amount: u64,
        entry_price: u64,
        current_price: u64,
        is_long: bool,
        pnl: u64, // Changed from i64 to u64
        created_at: u64,
        is_active: bool,
    }

    struct VaultSettings has store, drop {
        max_daily_loss: u64,
        max_position_size: u64,
        auto_compound: bool,
        risk_level: u8, // 1-5
    }

    // Events
    #[event]
    struct PositionOpenedEvent has drop, store {
        vault_owner: address,
        position_id: u64,
        trader_address: address,
        symbol: vector<u8>,
        amount: u64,
        entry_price: u64,
        is_long: bool,
        timestamp: u64,
    }

    #[event]
    struct PositionClosedEvent has drop, store {
        vault_owner: address,
        position_id: u64,
        exit_price: u64,
        pnl: u64, // Changed from i64 to u64
        timestamp: u64,
    }

    #[event]
    struct VaultBalanceUpdatedEvent has drop, store {
        vault_owner: address,
        old_balance: u64,
        new_balance: u64,
        change_amount: u64, // Changed from i64 to u64 - we'll track direction separately
        timestamp: u64,
    }

    #[event]
    struct VaultTransactionEvent has drop, store {
        user: address,
        vault_id: u64,
        transaction_type: vector<u8>,
        amount: u64,
        change_amount: u64,
        timestamp: u64,
    }

    // Initialize vault for user
    public entry fun initialize_vault(
        user: &signer,
        initial_deposit: u64,
        max_daily_loss: u64,
        max_position_size: u64,
        risk_level: u8
    ) {
        let user_addr = signer::address_of(user);
        assert!(!exists<VaultInfo>(user_addr), error::already_exists(E_VAULT_ALREADY_EXISTS));
        assert!(risk_level >= 1 && risk_level <= 5, error::invalid_argument(E_INVALID_AMOUNT));

        // Handle initial deposit if provided
        if (initial_deposit > 0) {
            let deposit = coin::withdraw<AptosCoin>(user, initial_deposit);
            coin::deposit(user_addr, deposit);
        };

        let vault = VaultInfo {
            owner: user_addr,
            balance: initial_deposit,
            locked_balance: 0,
            positions: vector::empty(),
            daily_pnl: 0,
            total_pnl: 0,
            last_updated: timestamp::now_seconds(),
        };

        move_to(user, vault);
    }

    // Add funds to vault
    public entry fun deposit(user: &signer, amount: u64) acquires VaultInfo {
        let user_addr = signer::address_of(user);
        assert!(exists<VaultInfo>(user_addr), error::not_found(E_VAULT_NOT_EXISTS));
        assert!(amount > 0, error::invalid_argument(E_INVALID_AMOUNT));

        // Transfer funds
        let deposit = coin::withdraw<AptosCoin>(user, amount);
        coin::deposit(user_addr, deposit);

        // Update vault
        let vault = borrow_global_mut<VaultInfo>(user_addr);
        let old_balance = vault.balance;
        vault.balance = vault.balance + amount;
        vault.last_updated = timestamp::now_seconds();

        // Emit event
        event::emit(VaultBalanceUpdatedEvent {
            vault_owner: user_addr,
            old_balance,
            new_balance: vault.balance,
            change_amount: amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Withdraw funds from vault
    public entry fun withdraw(
        user: &signer,
        vault_id: u64,
        amount: u64
    ) acquires VaultInfo {
        let user_addr = signer::address_of(user);
        assert!(exists<VaultInfo>(user_addr), E_VAULT_NOT_EXISTS);
        
        let vault = borrow_global_mut<VaultInfo>(user_addr);
        assert!(vault.balance >= amount, E_INSUFFICIENT_BALANCE);
        
        vault.balance = vault.balance - amount;
        
        // Transfer funds to user
        coin::transfer<AptosCoin>(user, user_addr, amount);
        
        // Emit event
        event::emit(VaultTransactionEvent {
            user: signer::address_of(user),
            vault_id: 0, // Since we're using simple vault structure
            transaction_type: b"withdraw",
            amount,
            change_amount: amount, // Amount withdrawn
            timestamp: timestamp::now_seconds(),
        });
    }

    // Open a new position
    public fun open_position(
        vault_owner: address,
        trader_address: address,
        symbol: vector<u8>,
        amount: u64,
        entry_price: u64,
        is_long: bool
    ): u64 acquires VaultInfo {
        assert!(exists<VaultInfo>(vault_owner), error::not_found(E_VAULT_NOT_EXISTS));

        let vault = borrow_global_mut<VaultInfo>(vault_owner);
        assert!(amount <= (vault.balance - vault.locked_balance), error::invalid_argument(E_INSUFFICIENT_BALANCE));

        // Generate position ID (simple counter based on vector length)
        let position_id = vector::length(&vault.positions);

        // Create position
        let position = Position {
            id: position_id,
            trader_address,
            symbol,
            amount,
            entry_price,
            current_price: entry_price,
            is_long,
            pnl: 0,
            created_at: timestamp::now_seconds(),
            is_active: true,
        };

        // Add position and lock funds
        vector::push_back(&mut vault.positions, position);
        vault.locked_balance = vault.locked_balance + amount;
        vault.last_updated = timestamp::now_seconds();

        // Emit event
        event::emit(PositionOpenedEvent {
            vault_owner,
            position_id,
            trader_address,
            symbol,
            amount,
            entry_price,
            is_long,
            timestamp: timestamp::now_seconds(),
        });

        position_id
    }

    // Close a position
    public fun close_position(
        vault_owner: address,
        position_id: u64,
        exit_price: u64
    ) acquires VaultInfo {
        assert!(exists<VaultInfo>(vault_owner), error::not_found(E_VAULT_NOT_EXISTS));

        let vault = borrow_global_mut<VaultInfo>(vault_owner);
        assert!(position_id < vector::length(&vault.positions), error::not_found(E_POSITION_NOT_FOUND));

        let position = vector::borrow_mut(&mut vault.positions, position_id);
        assert!(position.is_active, error::invalid_state(E_POSITION_NOT_FOUND));

        // Calculate P&L - using u64 arithmetic
        let pnl = if (position.is_long) {
            if (exit_price > position.entry_price) {
                ((exit_price - position.entry_price) * position.amount) / position.entry_price
            } else {
                0 // Loss, but we'll track as 0 for simplicity
            }
        } else {
            if (position.entry_price > exit_price) {
                ((position.entry_price - exit_price) * position.amount) / position.entry_price
            } else {
                0 // Loss, but we'll track as 0 for simplicity
            }
        };

        // Update position
        position.current_price = exit_price;
        position.pnl = pnl;
        position.is_active = false;

        // Update vault
        vault.locked_balance = vault.locked_balance - position.amount;
        vault.total_pnl = vault.total_pnl + pnl;
        vault.daily_pnl = vault.daily_pnl + pnl;

        // Update balance based on P&L
        if (pnl >= 0) {
            vault.balance = vault.balance + (pnl as u64);
        } else {
            let loss = (pnl as u64);
            if (loss <= vault.balance) {
                vault.balance = vault.balance - loss;
            } else {
                vault.balance = 0;
            };
        };

        vault.last_updated = timestamp::now_seconds();

        // Emit event
        event::emit(PositionClosedEvent {
            vault_owner,
            position_id,
            exit_price,
            pnl,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Update position price (for tracking)
    public fun update_position_price(
        vault_owner: address,
        position_id: u64,
        current_price: u64
    ) acquires VaultInfo {
        assert!(exists<VaultInfo>(vault_owner), error::not_found(E_VAULT_NOT_EXISTS));

        let vault = borrow_global_mut<VaultInfo>(vault_owner);
        assert!(position_id < vector::length(&vault.positions), error::not_found(E_POSITION_NOT_FOUND));

        let position = vector::borrow_mut(&mut vault.positions, position_id);
        assert!(position.is_active, error::invalid_state(E_POSITION_NOT_FOUND));

        // Update current price and unrealized P&L - using u64 arithmetic
        position.current_price = current_price;

        let pnl = if (position.is_long) {
            if (current_price > position.entry_price) {
                ((current_price - position.entry_price) * position.amount) / position.entry_price
            } else {
                0 // Unrealized loss, track as 0 for simplicity
            }
        } else {
            if (position.entry_price > current_price) {
                ((position.entry_price - current_price) * position.amount) / position.entry_price
            } else {
                0 // Unrealized loss, track as 0 for simplicity
            }
        };

        position.pnl = pnl;
        vault.last_updated = timestamp::now_seconds();
    }

    // Emergency close all positions
    public entry fun emergency_close_all(user: &signer) acquires VaultInfo {
        let user_addr = signer::address_of(user);
        assert!(exists<VaultInfo>(user_addr), error::not_found(E_VAULT_NOT_EXISTS));

        let vault = borrow_global_mut<VaultInfo>(user_addr);
        let i = 0;
        let len = vector::length(&vault.positions);

        while (i < len) {
            let position = vector::borrow_mut(&mut vault.positions, i);
            if (position.is_active) {
                position.is_active = false;
                // Release locked funds
                vault.locked_balance = vault.locked_balance - position.amount;
            };
            i = i + 1;
        };

        vault.last_updated = timestamp::now_seconds();
    }

    // View functions
    #[view]
    public fun get_vault_info(vault_owner: address): (u64, u64, u64, u64, u64) acquires VaultInfo {
        assert!(exists<VaultInfo>(vault_owner), error::not_found(E_VAULT_NOT_EXISTS));
        let vault = borrow_global<VaultInfo>(vault_owner);
        (
            vault.balance,
            vault.locked_balance,
            vault.daily_pnl,
            vault.total_pnl,
            vector::length(&vault.positions)
        )
    }

    #[view]
    public fun get_position(vault_owner: address, position_id: u64): Position acquires VaultInfo {
        assert!(exists<VaultInfo>(vault_owner), error::not_found(E_VAULT_NOT_EXISTS));
        let vault = borrow_global<VaultInfo>(vault_owner);
        assert!(position_id < vector::length(&vault.positions), error::not_found(E_POSITION_NOT_FOUND));
        *vector::borrow(&vault.positions, position_id)
    }

    #[view]
    public fun get_active_positions_count(vault_owner: address): u64 acquires VaultInfo {
        assert!(exists<VaultInfo>(vault_owner), error::not_found(E_VAULT_NOT_EXISTS));
        let vault = borrow_global<VaultInfo>(vault_owner);
        
        let active_count = 0;
        let i = 0;
        let len = vector::length(&vault.positions);
        
        while (i < len) {
            let position = vector::borrow(&vault.positions, i);
            if (position.is_active) {
                active_count = active_count + 1;
            };
            i = i + 1;
        };
        
        active_count
    }

    #[view]
    public fun vault_exists(vault_owner: address): bool {
        exists<VaultInfo>(vault_owner)
    }

    #[view]
    public fun get_available_balance(vault_owner: address): u64 acquires VaultInfo {
        assert!(exists<VaultInfo>(vault_owner), error::not_found(E_VAULT_NOT_EXISTS));
        let vault = borrow_global<VaultInfo>(vault_owner);
        vault.balance - vault.locked_balance
    }
}
