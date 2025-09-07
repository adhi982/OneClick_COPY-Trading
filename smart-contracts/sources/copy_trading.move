module copy_trading::main {
    use std::signer;
    use std::vector;
    use std::error;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::event;

    // Error codes
    const E_NOT_INITIALIZED: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_UNAUTHORIZED: u64 = 3;
    const E_INVALID_AMOUNT: u64 = 4;
    const E_TRADER_NOT_FOUND: u64 = 5;
    const E_ALREADY_EXISTS: u64 = 6;

    // Structs
    struct UserVault has key {
        balance: u64,
        total_allocated: u64,
        copy_settings: vector<CopySetting>,
        created_at: u64,
    }

    struct CopySetting has store, drop {
        trader_address: address,
        allocation_amount: u64,
        max_position_size: u64,
        stop_loss_percentage: u8,
        is_active: bool
    }

    struct TraderProfile has key {
        is_verified: bool,
        total_followers: u64,
        total_aum: u64,
        performance_fee: u8,
        win_rate: u64,
        total_trades: u64,
        created_at: u64,
    }

    struct Position has store, drop {
        trader_address: address,
        symbol: vector<u8>,
        amount: u64,
        entry_price: u64,
        is_buy: bool,
        timestamp: u64,
        is_active: bool,
    }

    // Events
    #[event]
    struct VaultCreatedEvent has drop, store {
        user_address: address,
        initial_balance: u64,
        timestamp: u64,
    }

    #[event]
    struct TradeExecutedEvent has drop, store {
        trader_address: address,
        follower_address: address,
        symbol: vector<u8>,
        amount: u64,
        is_buy: bool,
        timestamp: u64,
    }

    #[event]
    struct TraderRegisteredEvent has drop, store {
        trader_address: address,
        performance_fee: u8,
        timestamp: u64,
    }

    // Main Functions
    public entry fun create_user_vault(user: &signer, initial_deposit: u64) {
        let user_addr = signer::address_of(user);
        
        // Ensure vault doesn't already exist
        assert!(!exists<UserVault>(user_addr), error::already_exists(E_ALREADY_EXISTS));
        
        // Transfer initial deposit if provided
        if (initial_deposit > 0) {
            let deposit = coin::withdraw<AptosCoin>(user, initial_deposit);
            coin::deposit(user_addr, deposit);
        };
        
        let vault = UserVault {
            balance: initial_deposit,
            total_allocated: 0,
            copy_settings: vector::empty(),
            created_at: timestamp::now_seconds(),
        };
        move_to(user, vault);

        // Emit event
        event::emit(VaultCreatedEvent {
            user_address: user_addr,
            initial_balance: initial_deposit,
            timestamp: timestamp::now_seconds(),
        });
    }

    public entry fun register_trader(
        trader: &signer,
        performance_fee: u8
    ) {
        let trader_addr = signer::address_of(trader);
        
        // Ensure trader profile doesn't already exist
        assert!(!exists<TraderProfile>(trader_addr), error::already_exists(E_ALREADY_EXISTS));
        assert!(performance_fee <= 20, error::invalid_argument(E_INVALID_AMOUNT)); // Max 20% fee
        
        let profile = TraderProfile {
            is_verified: false,
            total_followers: 0,
            total_aum: 0,
            performance_fee,
            win_rate: 0,
            total_trades: 0,
            created_at: timestamp::now_seconds(),
        };
        move_to(trader, profile);

        // Emit event
        event::emit(TraderRegisteredEvent {
            trader_address: trader_addr,
            performance_fee,
            timestamp: timestamp::now_seconds(),
        });
    }

    public entry fun follow_trader(
        follower: &signer,
        trader_address: address,
        allocation_amount: u64,
        max_position_size: u64,
        stop_loss_percentage: u8
    ) acquires UserVault, TraderProfile {
        let follower_addr = signer::address_of(follower);
        
        // Ensure user vault exists
        assert!(exists<UserVault>(follower_addr), error::not_found(E_NOT_INITIALIZED));
        
        // Ensure trader profile exists
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));
        
        let vault = borrow_global_mut<UserVault>(follower_addr);
        let trader_profile = borrow_global_mut<TraderProfile>(trader_address);
        
        // Validate allocation amount
        assert!(allocation_amount > 0, error::invalid_argument(E_INVALID_AMOUNT));
        assert!(allocation_amount <= vault.balance, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        assert!(stop_loss_percentage > 0 && stop_loss_percentage <= 100, error::invalid_argument(E_INVALID_AMOUNT));
        
        // Create copy setting
        let copy_setting = CopySetting {
            trader_address,
            allocation_amount,
            max_position_size,
            stop_loss_percentage,
            is_active: true,
        };
        
        vector::push_back(&mut vault.copy_settings, copy_setting);
        vault.total_allocated = vault.total_allocated + allocation_amount;
        
        // Update trader stats
        trader_profile.total_followers = trader_profile.total_followers + 1;
        trader_profile.total_aum = trader_profile.total_aum + allocation_amount;
    }

    public entry fun execute_copy_trade(
        trader: &signer,
        symbol: vector<u8>,
        amount: u64,
        is_buy: bool
    ) acquires TraderProfile {
        let trader_addr = signer::address_of(trader);
        
        // Ensure trader profile exists
        assert!(exists<TraderProfile>(trader_addr), error::not_found(E_TRADER_NOT_FOUND));
        
        let trader_profile = borrow_global_mut<TraderProfile>(trader_addr);
        
        // Update trader stats
        trader_profile.total_trades = trader_profile.total_trades + 1;
        
        // Emit trade event for followers to process
        event::emit(TradeExecutedEvent {
            trader_address: trader_addr,
            follower_address: trader_addr, // This will be updated for each follower
            symbol,
            amount,
            is_buy,
            timestamp: timestamp::now_seconds(),
        });
        
        // Note: In a full implementation, this would iterate through all followers
        // and execute proportional trades for each one based on their copy settings
    }

    public entry fun unfollow_trader(
        follower: &signer,
        trader_address: address
    ) acquires UserVault, TraderProfile {
        let follower_addr = signer::address_of(follower);
        
        // Ensure user vault exists
        assert!(exists<UserVault>(follower_addr), error::not_found(E_NOT_INITIALIZED));
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));
        
        let vault = borrow_global_mut<UserVault>(follower_addr);
        let trader_profile = borrow_global_mut<TraderProfile>(trader_address);
        
        // Find and remove the copy setting
        let i = 0;
        let len = vector::length(&vault.copy_settings);
        let found = false;
        let allocation_to_remove = 0;
        
        while (i < len) {
            let setting = vector::borrow(&vault.copy_settings, i);
            if (setting.trader_address == trader_address) {
                allocation_to_remove = setting.allocation_amount;
                vector::remove(&mut vault.copy_settings, i);
                found = true;
                break
            };
            i = i + 1;
        };
        
        if (found) {
            vault.total_allocated = vault.total_allocated - allocation_to_remove;
            trader_profile.total_followers = trader_profile.total_followers - 1;
            trader_profile.total_aum = trader_profile.total_aum - allocation_to_remove;
        };
    }

    public entry fun emergency_stop(user: &signer) acquires UserVault {
        let user_addr = signer::address_of(user);
        assert!(exists<UserVault>(user_addr), error::not_found(E_NOT_INITIALIZED));
        
        let vault = borrow_global_mut<UserVault>(user_addr);
        
        // Deactivate all copy settings
        let i = 0;
        let len = vector::length(&vault.copy_settings);
        while (i < len) {
            let setting = vector::borrow_mut(&mut vault.copy_settings, i);
            setting.is_active = false;
            i = i + 1;
        };
        
        // Reset total allocated
        vault.total_allocated = 0;
    }

    public entry fun deposit_funds(user: &signer, amount: u64) acquires UserVault {
        let user_addr = signer::address_of(user);
        assert!(exists<UserVault>(user_addr), error::not_found(E_NOT_INITIALIZED));
        assert!(amount > 0, error::invalid_argument(E_INVALID_AMOUNT));
        
        // Transfer funds
        let deposit = coin::withdraw<AptosCoin>(user, amount);
        coin::deposit(user_addr, deposit);
        
        // Update vault balance
        let vault = borrow_global_mut<UserVault>(user_addr);
        vault.balance = vault.balance + amount;
    }

    public entry fun withdraw_funds(user: &signer, amount: u64) acquires UserVault {
        let user_addr = signer::address_of(user);
        assert!(exists<UserVault>(user_addr), error::not_found(E_NOT_INITIALIZED));
        assert!(amount > 0, error::invalid_argument(E_INVALID_AMOUNT));
        
        let vault = borrow_global_mut<UserVault>(user_addr);
        let available_balance = vault.balance - vault.total_allocated;
        assert!(amount <= available_balance, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        
        // Transfer funds
        let withdrawal = coin::withdraw<AptosCoin>(user, amount);
        coin::deposit(user_addr, withdrawal);
        
        // Update vault balance
        vault.balance = vault.balance - amount;
    }

    // View functions
    #[view]
    public fun get_user_vault(user_address: address): (u64, u64, u64) acquires UserVault {
        assert!(exists<UserVault>(user_address), error::not_found(E_NOT_INITIALIZED));
        let vault = borrow_global<UserVault>(user_address);
        (vault.balance, vault.total_allocated, vector::length(&vault.copy_settings))
    }

    #[view]
    public fun get_trader_profile(trader_address: address): (bool, u64, u64, u8, u64, u64) acquires TraderProfile {
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));
        let profile = borrow_global<TraderProfile>(trader_address);
        (
            profile.is_verified,
            profile.total_followers,
            profile.total_aum,
            profile.performance_fee,
            profile.win_rate,
            profile.total_trades
        )
    }

    #[view]
    public fun is_following_trader(user_address: address, trader_address: address): bool acquires UserVault {
        if (!exists<UserVault>(user_address)) {
            return false
        };
        
        let vault = borrow_global<UserVault>(user_address);
        let i = 0;
        let len = vector::length(&vault.copy_settings);
        
        while (i < len) {
            let setting = vector::borrow(&vault.copy_settings, i);
            if (setting.trader_address == trader_address && setting.is_active) {
                return true
            };
            i = i + 1;
        };
        
        false
    }

    #[view]
    public fun vault_exists(user_address: address): bool {
        exists<UserVault>(user_address)
    }

    #[view]
    public fun trader_exists(trader_address: address): bool {
        exists<TraderProfile>(trader_address)
    }
}
