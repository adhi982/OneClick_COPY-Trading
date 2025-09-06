module copy_trading::trader_registry {
    use std::signer;
    use std::vector;
    use std::error;
    use std::string::{Self, String};
    use aptos_framework::timestamp;
    use aptos_framework::event;

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_TRADER_NOT_FOUND: u64 = 2;
    const E_ALREADY_REGISTERED: u64 = 3;
    const E_INVALID_FEE: u64 = 4;
    const E_INVALID_RATING: u64 = 5;

    struct TraderRegistry has key {
        admin: address,
        verified_traders: vector<address>,
        total_registered: u64,
    }

    struct TraderProfile has key {
        trader_address: address,
        is_verified: bool,
        is_active: bool,
        registration_date: u64,
        verification_date: u64,
        
        // Performance metrics
        total_followers: u64,
        total_aum: u64,
        performance_fee: u8, // 0-20%
        
        // Trading statistics
        total_trades: u64,
        winning_trades: u64,
        losing_trades: u64,
        win_rate: u64, // Percentage * 100
        
        // Risk metrics
        max_drawdown: u64,
        average_return: i64,
        sharpe_ratio: u64,
        risk_score: u8, // 1-10 (1 = very safe, 10 = very risky)
        
        // Profile info
        display_name: String,
        bio: String,
        strategy_description: String,
    }

    struct TraderStats has store {
        daily_returns: vector<i64>,
        monthly_returns: vector<i64>,
        trade_history: vector<TradeRecord>,
        last_updated: u64,
    }

    struct TradeRecord has store, drop {
        symbol: vector<u8>,
        amount: u64,
        entry_price: u64,
        exit_price: u64,
        pnl: i64,
        is_long: bool,
        duration: u64,
        timestamp: u64,
    }

    // Events
    struct TraderRegisteredEvent has drop, store {
        trader_address: address,
        display_name: String,
        performance_fee: u8,
        timestamp: u64,
    }

    struct TraderVerifiedEvent has drop, store {
        trader_address: address,
        admin_address: address,
        timestamp: u64,
    }

    struct TraderStatsUpdatedEvent has drop, store {
        trader_address: address,
        win_rate: u64,
        total_trades: u64,
        risk_score: u8,
        timestamp: u64,
    }

    // Initialize the registry (called once during deployment)
    fun init_module(admin: &signer) {
        let registry = TraderRegistry {
            admin: signer::address_of(admin),
            verified_traders: vector::empty(),
            total_registered: 0,
        };
        move_to(admin, registry);
    }

    // Register as a trader
    public entry fun register_trader(
        trader: &signer,
        display_name: vector<u8>,
        bio: vector<u8>,
        strategy_description: vector<u8>,
        performance_fee: u8
    ) acquires TraderRegistry {
        let trader_addr = signer::address_of(trader);
        assert!(!exists<TraderProfile>(trader_addr), error::already_exists(E_ALREADY_REGISTERED));
        assert!(performance_fee <= 20, error::invalid_argument(E_INVALID_FEE));

        let profile = TraderProfile {
            trader_address: trader_addr,
            is_verified: false,
            is_active: true,
            registration_date: timestamp::now_seconds(),
            verification_date: 0,
            
            total_followers: 0,
            total_aum: 0,
            performance_fee,
            
            total_trades: 0,
            winning_trades: 0,
            losing_trades: 0,
            win_rate: 0,
            
            max_drawdown: 0,
            average_return: 0,
            sharpe_ratio: 0,
            risk_score: 5, // Default medium risk
            
            display_name: string::utf8(display_name),
            bio: string::utf8(bio),
            strategy_description: string::utf8(strategy_description),
        };

        move_to(trader, profile);

        // Update registry
        let registry = borrow_global_mut<TraderRegistry>(@copy_trading);
        registry.total_registered = registry.total_registered + 1;

        // Emit event
        event::emit(TraderRegisteredEvent {
            trader_address: trader_addr,
            display_name: string::utf8(display_name),
            performance_fee,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Verify a trader (admin only)
    public entry fun verify_trader(
        admin: &signer,
        trader_address: address
    ) acquires TraderRegistry, TraderProfile {
        let admin_addr = signer::address_of(admin);
        let registry = borrow_global_mut<TraderRegistry>(@copy_trading);
        
        assert!(admin_addr == registry.admin, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));

        let profile = borrow_global_mut<TraderProfile>(trader_address);
        profile.is_verified = true;
        profile.verification_date = timestamp::now_seconds();

        // Add to verified list
        vector::push_back(&mut registry.verified_traders, trader_address);

        // Emit event
        event::emit(TraderVerifiedEvent {
            trader_address,
            admin_address: admin_addr,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Update trader performance metrics
    public fun update_trader_performance(
        trader_address: address,
        total_trades: u64,
        winning_trades: u64,
        losing_trades: u64,
        max_drawdown: u64,
        average_return: i64,
        risk_score: u8
    ) acquires TraderProfile {
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));
        assert!(risk_score >= 1 && risk_score <= 10, error::invalid_argument(E_INVALID_RATING));

        let profile = borrow_global_mut<TraderProfile>(trader_address);
        profile.total_trades = total_trades;
        profile.winning_trades = winning_trades;
        profile.losing_trades = losing_trades;
        profile.max_drawdown = max_drawdown;
        profile.average_return = average_return;
        profile.risk_score = risk_score;

        // Calculate win rate
        if (total_trades > 0) {
            profile.win_rate = (winning_trades * 10000) / total_trades; // Percentage * 100
        };

        // Emit event
        event::emit(TraderStatsUpdatedEvent {
            trader_address,
            win_rate: profile.win_rate,
            total_trades,
            risk_score,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Update follower count and AUM
    public fun update_trader_followers(
        trader_address: address,
        follower_change: i64,
        aum_change: i64
    ) acquires TraderProfile {
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));

        let profile = borrow_global_mut<TraderProfile>(trader_address);
        
        // Update followers
        if (follower_change >= 0) {
            profile.total_followers = profile.total_followers + (follower_change as u64);
        } else {
            let decrease = (-follower_change as u64);
            if (decrease <= profile.total_followers) {
                profile.total_followers = profile.total_followers - decrease;
            } else {
                profile.total_followers = 0;
            };
        };

        // Update AUM
        if (aum_change >= 0) {
            profile.total_aum = profile.total_aum + (aum_change as u64);
        } else {
            let decrease = (-aum_change as u64);
            if (decrease <= profile.total_aum) {
                profile.total_aum = profile.total_aum - decrease;
            } else {
                profile.total_aum = 0;
            };
        };
    }

    // Deactivate trader (self or admin)
    public entry fun deactivate_trader(
        caller: &signer,
        trader_address: address
    ) acquires TraderRegistry, TraderProfile {
        let caller_addr = signer::address_of(caller);
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));

        let registry = borrow_global<TraderRegistry>(@copy_trading);
        
        // Check authorization (self or admin)
        assert!(
            caller_addr == trader_address || caller_addr == registry.admin,
            error::permission_denied(E_NOT_AUTHORIZED)
        );

        let profile = borrow_global_mut<TraderProfile>(trader_address);
        profile.is_active = false;
    }

    // Reactivate trader (self only)
    public entry fun reactivate_trader(trader: &signer) acquires TraderProfile {
        let trader_addr = signer::address_of(trader);
        assert!(exists<TraderProfile>(trader_addr), error::not_found(E_TRADER_NOT_FOUND));

        let profile = borrow_global_mut<TraderProfile>(trader_addr);
        profile.is_active = true;
    }

    // Update trader profile information
    public entry fun update_profile(
        trader: &signer,
        display_name: vector<u8>,
        bio: vector<u8>,
        strategy_description: vector<u8>,
        performance_fee: u8
    ) acquires TraderProfile {
        let trader_addr = signer::address_of(trader);
        assert!(exists<TraderProfile>(trader_addr), error::not_found(E_TRADER_NOT_FOUND));
        assert!(performance_fee <= 20, error::invalid_argument(E_INVALID_FEE));

        let profile = borrow_global_mut<TraderProfile>(trader_addr);
        profile.display_name = string::utf8(display_name);
        profile.bio = string::utf8(bio);
        profile.strategy_description = string::utf8(strategy_description);
        profile.performance_fee = performance_fee;
    }

    // View functions
    #[view]
    public fun get_trader_profile(trader_address: address): (
        bool, bool, u64, u64, u8, u64, u64, u64, u8, String, String
    ) acquires TraderProfile {
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));
        let profile = borrow_global<TraderProfile>(trader_address);
        (
            profile.is_verified,
            profile.is_active,
            profile.total_followers,
            profile.total_aum,
            profile.performance_fee,
            profile.total_trades,
            profile.win_rate,
            profile.max_drawdown,
            profile.risk_score,
            profile.display_name,
            profile.strategy_description
        )
    }

    #[view]
    public fun is_verified_trader(trader_address: address): bool acquires TraderProfile {
        if (!exists<TraderProfile>(trader_address)) {
            return false
        };
        let profile = borrow_global<TraderProfile>(trader_address);
        profile.is_verified && profile.is_active
    }

    #[view]
    public fun get_trader_stats(trader_address: address): (u64, u64, u64, u64, i64, u8) acquires TraderProfile {
        assert!(exists<TraderProfile>(trader_address), error::not_found(E_TRADER_NOT_FOUND));
        let profile = borrow_global<TraderProfile>(trader_address);
        (
            profile.total_trades,
            profile.winning_trades,
            profile.losing_trades,
            profile.win_rate,
            profile.average_return,
            profile.risk_score
        )
    }

    #[view]
    public fun get_verified_traders(): vector<address> acquires TraderRegistry {
        let registry = borrow_global<TraderRegistry>(@copy_trading);
        registry.verified_traders
    }

    #[view]
    public fun get_registry_stats(): (u64, u64) acquires TraderRegistry {
        let registry = borrow_global<TraderRegistry>(@copy_trading);
        (registry.total_registered, vector::length(&registry.verified_traders))
    }

    #[view]
    public fun trader_exists(trader_address: address): bool {
        exists<TraderProfile>(trader_address)
    }
}
