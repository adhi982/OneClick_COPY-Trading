#[test_only]
module copy_trading::copy_trading_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::timestamp;
    use copy_trading::main;
    use copy_trading::user_vault;
    use copy_trading::trader_registry;
    use copy_trading::risk_manager;

    // Test helper function to setup the testing environment
    fun setup_test(admin: &signer, user: &signer, trader: &signer) {
        // Initialize timestamp for testing
        timestamp::set_time_has_started_for_testing(admin);
        
        // Initialize AptosCoin for testing
        aptos_coin::initialize_for_test(admin);
        
        // Register accounts for AptosCoin
        coin::register<AptosCoin>(user);
        coin::register<AptosCoin>(trader);
        
        // Mint some coins for testing
        aptos_coin::mint(admin, signer::address_of(user), 1000000);
        aptos_coin::mint(admin, signer::address_of(trader), 1000000);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    fun test_create_user_vault(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Create user vault
        main::create_user_vault(&user, 100000);
        
        // Verify vault was created
        let (balance, allocated, settings_count) = main::get_user_vault(signer::address_of(&user));
        assert!(balance == 100000, 0);
        assert!(allocated == 0, 1);
        assert!(settings_count == 0, 2);
        
        // Verify vault exists
        assert!(main::vault_exists(signer::address_of(&user)), 3);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    fun test_register_trader(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Register trader
        main::register_trader(&trader, 15); // 15% performance fee
        
        // Verify trader was registered
        let (is_verified, followers, aum, fee, win_rate, total_trades) = 
            main::get_trader_profile(signer::address_of(&trader));
        assert!(!is_verified, 0); // Should not be verified initially
        assert!(followers == 0, 1);
        assert!(aum == 0, 2);
        assert!(fee == 15, 3);
        assert!(win_rate == 0, 4);
        assert!(total_trades == 0, 5);
        
        // Verify trader exists
        assert!(main::trader_exists(signer::address_of(&trader)), 6);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    fun test_follow_trader(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Create user vault
        main::create_user_vault(&user, 100000);
        
        // Register trader
        main::register_trader(&trader, 10);
        
        // Follow trader
        main::follow_trader(
            &user,
            signer::address_of(&trader),
            20000, // Allocation amount
            5000,  // Max position size
            10     // 10% stop loss
        );
        
        // Verify follow relationship
        assert!(main::is_following_trader(
            signer::address_of(&user), 
            signer::address_of(&trader)
        ), 0);
        
        // Check updated vault
        let (balance, allocated, settings_count) = main::get_user_vault(signer::address_of(&user));
        assert!(allocated == 20000, 1);
        assert!(settings_count == 1, 2);
        
        // Check updated trader profile
        let (_, followers, aum, _, _, _) = main::get_trader_profile(signer::address_of(&trader));
        assert!(followers == 1, 3);
        assert!(aum == 20000, 4);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    fun test_unfollow_trader(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Setup: Create vault, register trader, follow trader
        main::create_user_vault(&user, 100000);
        main::register_trader(&trader, 10);
        main::follow_trader(&user, signer::address_of(&trader), 20000, 5000, 10);
        
        // Verify following
        assert!(main::is_following_trader(
            signer::address_of(&user), 
            signer::address_of(&trader)
        ), 0);
        
        // Unfollow trader
        main::unfollow_trader(&user, signer::address_of(&trader));
        
        // Verify unfollowing
        assert!(!main::is_following_trader(
            signer::address_of(&user), 
            signer::address_of(&trader)
        ), 1);
        
        // Check updated vault
        let (_, allocated, settings_count) = main::get_user_vault(signer::address_of(&user));
        assert!(allocated == 0, 2);
        assert!(settings_count == 0, 3);
        
        // Check updated trader profile
        let (_, followers, aum, _, _, _) = main::get_trader_profile(signer::address_of(&trader));
        assert!(followers == 0, 4);
        assert!(aum == 0, 5);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    fun test_emergency_stop(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Setup: Create vault, register trader, follow trader
        main::create_user_vault(&user, 100000);
        main::register_trader(&trader, 10);
        main::follow_trader(&user, signer::address_of(&trader), 20000, 5000, 10);
        
        // Verify following
        assert!(main::is_following_trader(
            signer::address_of(&user), 
            signer::address_of(&trader)
        ), 0);
        
        // Execute emergency stop
        main::emergency_stop(&user);
        
        // Verify all copy settings are deactivated
        assert!(!main::is_following_trader(
            signer::address_of(&user), 
            signer::address_of(&trader)
        ), 1);
        
        // Check updated vault
        let (_, allocated, _) = main::get_user_vault(signer::address_of(&user));
        assert!(allocated == 0, 2);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    fun test_deposit_and_withdraw_funds(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Create user vault with initial deposit
        main::create_user_vault(&user, 50000);
        
        // Verify initial balance
        let (balance, _, _) = main::get_user_vault(signer::address_of(&user));
        assert!(balance == 50000, 0);
        
        // Deposit additional funds
        main::deposit_funds(&user, 25000);
        
        // Verify updated balance
        let (balance, _, _) = main::get_user_vault(signer::address_of(&user));
        assert!(balance == 75000, 1);
        
        // Withdraw some funds
        main::withdraw_funds(&user, 15000);
        
        // Verify final balance
        let (balance, _, _) = main::get_user_vault(signer::address_of(&user));
        assert!(balance == 60000, 2);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    fun test_execute_copy_trade(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Setup
        main::register_trader(&trader, 15);
        
        // Execute a trade
        main::execute_copy_trade(
            &trader,
            b"APT/USDC",
            1000,
            true // is_buy
        );
        
        // Verify trader stats updated
        let (_, _, _, _, _, total_trades) = main::get_trader_profile(signer::address_of(&trader));
        assert!(total_trades == 1, 0);
    }

    #[test(admin = @0x1, user = @0x2)]
    #[expected_failure(abort_code = 0x60006)] // E_ALREADY_EXISTS
    fun test_create_vault_twice_fails(admin: signer, user: signer) {
        setup_test(&admin, &user, &admin); // Using admin as dummy trader
        
        // Create vault first time
        main::create_user_vault(&user, 50000);
        
        // Try to create vault again - should fail
        main::create_user_vault(&user, 25000);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    #[expected_failure(abort_code = 0x60001)] // E_NOT_INITIALIZED
    fun test_follow_trader_without_vault_fails(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Register trader
        main::register_trader(&trader, 10);
        
        // Try to follow trader without creating vault first - should fail
        main::follow_trader(&user, signer::address_of(&trader), 20000, 5000, 10);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    #[expected_failure(abort_code = 0x60005)] // E_TRADER_NOT_FOUND
    fun test_follow_unregistered_trader_fails(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Create user vault
        main::create_user_vault(&user, 100000);
        
        // Try to follow unregistered trader - should fail
        main::follow_trader(&user, signer::address_of(&trader), 20000, 5000, 10);
    }

    #[test(admin = @0x1, user = @0x2, trader = @0x3)]
    #[expected_failure(abort_code = 0x60004)] // E_INVALID_AMOUNT
    fun test_register_trader_with_high_fee_fails(admin: signer, user: signer, trader: signer) {
        setup_test(&admin, &user, &trader);
        
        // Try to register trader with >20% fee - should fail
        main::register_trader(&trader, 25);
    }

    // Test user vault module
    #[test(admin = @0x1, user = @0x2)]
    fun test_user_vault_operations(admin: signer, user: signer) {
        setup_test(&admin, &user, &admin); // Using admin as dummy
        
        // Initialize vault
        user_vault::initialize_vault(&user, 100000, 10000, 5000, 3);
        
        // Verify vault exists
        assert!(user_vault::vault_exists(signer::address_of(&user)), 0);
        
        // Check vault info
        let (balance, locked, daily_pnl, total_pnl, position_count) = 
            user_vault::get_vault_info(signer::address_of(&user));
        assert!(balance == 100000, 1);
        assert!(locked == 0, 2);
        assert!(daily_pnl == 0, 3);
        assert!(total_pnl == 0, 4);
        assert!(position_count == 0, 5);
        
        // Test deposit
        user_vault::deposit(&user, 25000);
        let (balance, _, _, _, _) = user_vault::get_vault_info(signer::address_of(&user));
        assert!(balance == 125000, 6);
        
        // Test withdrawal
        user_vault::withdraw(&user, 15000);
        let (balance, _, _, _, _) = user_vault::get_vault_info(signer::address_of(&user));
        assert!(balance == 110000, 7);
    }

    // Test risk manager
    #[test(admin = @0x1, user = @0x2)]
    fun test_risk_manager_profile(admin: signer, user: signer) {
        setup_test(&admin, &user, &admin);
        
        // Create risk profile
        risk_manager::create_risk_profile(
            &user,
            3, // risk level
            5000, // max daily loss
            2000, // max position size
            5, // max positions
            10, // stop loss %
            20  // take profit %
        );
        
        // Verify profile exists
        assert!(risk_manager::risk_profile_exists(signer::address_of(&user)), 0);
        
        // Check profile data
        let (risk_level, max_daily_loss, max_position_size, max_positions, daily_loss_so_far) = 
            risk_manager::get_user_risk_profile(signer::address_of(&user));
        assert!(risk_level == 3, 1);
        assert!(max_daily_loss == 5000, 2);
        assert!(max_position_size == 2000, 3);
        assert!(max_positions == 5, 4);
        assert!(daily_loss_so_far == 0, 5);
    }
}
