module copy_trading::risk_manager {
    use std::vector;
    use std::error;
    use std::signer;
    use aptos_framework::timestamp;
    use copy_trading::user_vault;
    use copy_trading::trader_registry;

    // Error codes
    const E_RISK_LIMIT_EXCEEDED: u64 = 1;
    const E_POSITION_SIZE_TOO_LARGE: u64 = 2;
    const E_DAILY_LIMIT_EXCEEDED: u64 = 3;
    const E_INVALID_RISK_LEVEL: u64 = 4;
    const E_MAX_POSITIONS_REACHED: u64 = 5;
    const E_UNVERIFIED_TRADER: u64 = 6;
    const E_INVALID_SYMBOL: u64 = 7;

    struct RiskParameters has key {
        max_position_count: u8,
        max_daily_loss_percentage: u8,
        max_single_position_percentage: u8,
        max_trader_allocation_percentage: u8,
        allowed_symbols: vector<vector<u8>>,
        blacklisted_traders: vector<address>,
        last_updated: u64,
    }

    struct UserRiskProfile has key {
        user_address: address,
        risk_level: u8, // 1-5 (Conservative to Aggressive)
        max_daily_loss: u64,
        max_position_size: u64,
        max_positions: u8,
        daily_loss_so_far: u64,
        daily_reset_timestamp: u64,
        allowed_traders: vector<address>,
        custom_limits: CustomLimits,
    }

    struct CustomLimits has store {
        max_leverage: u8,
        stop_loss_percentage: u8,
        take_profit_percentage: u8,
        trailing_stop: bool,
        auto_close_on_target: bool,
    }

    struct RiskCheckResult has drop {
        is_valid: bool,
        risk_score: u8,
        max_allowed_amount: u64,
        warning_message: vector<u8>,
        rejection_reason: vector<u8>,
    }

    struct DailyLimits has store {
        max_trades: u8,
        max_volume: u64,
        max_loss: u64,
        trades_today: u8,
        volume_today: u64,
        loss_today: u64,
    }

    // Initialize global risk parameters (admin only)
    fun init_module(admin: &signer) {
        let params = RiskParameters {
            max_position_count: 20,
            max_daily_loss_percentage: 20, // 20%
            max_single_position_percentage: 10, // 10%
            max_trader_allocation_percentage: 50, // 50%
            allowed_symbols: vector::empty(),
            blacklisted_traders: vector::empty(),
            last_updated: timestamp::now_seconds(),
        };
        move_to(admin, params);

        // Add some default allowed trading pairs
        let symbols = &mut params.allowed_symbols;
        vector::push_back(symbols, b"APT/USDC");
        vector::push_back(symbols, b"BTC/USDC");
        vector::push_back(symbols, b"ETH/USDC");
        vector::push_back(symbols, b"SOL/USDC");
    }

    // Create user risk profile
    public entry fun create_risk_profile(
        user: &signer,
        risk_level: u8,
        max_daily_loss: u64,
        max_position_size: u64,
        max_positions: u8,
        stop_loss_percentage: u8,
        take_profit_percentage: u8
    ) {
        let user_addr = signer::address_of(user);
        assert!(!exists<UserRiskProfile>(user_addr), error::already_exists(E_RISK_LIMIT_EXCEEDED));
        assert!(risk_level >= 1 && risk_level <= 5, error::invalid_argument(E_INVALID_RISK_LEVEL));

        let custom_limits = CustomLimits {
            max_leverage: get_max_leverage_for_risk_level(risk_level),
            stop_loss_percentage,
            take_profit_percentage,
            trailing_stop: false,
            auto_close_on_target: true,
        };

        let profile = UserRiskProfile {
            user_address: user_addr,
            risk_level,
            max_daily_loss,
            max_position_size,
            max_positions,
            daily_loss_so_far: 0,
            daily_reset_timestamp: get_today_timestamp(),
            allowed_traders: vector::empty(),
            custom_limits,
        };

        move_to(user, profile);
    }

    // Validate trade before execution
    public fun validate_trade(
        user_address: address,
        trader_address: address,
        symbol: vector<u8>,
        amount: u64,
        is_long: bool
    ): RiskCheckResult acquires UserRiskProfile, RiskParameters {
        // Check if user has risk profile
        if (!exists<UserRiskProfile>(user_address)) {
            return RiskCheckResult {
                is_valid: false,
                risk_score: 10,
                max_allowed_amount: 0,
                warning_message: b"",
                rejection_reason: b"No risk profile found",
            }
        };

        let user_profile = borrow_global_mut<UserRiskProfile>(user_address);
        let global_params = borrow_global<RiskParameters>(@copy_trading);

        // Reset daily limits if needed
        reset_daily_limits_if_needed(user_profile);

        // Check if trader is verified
        if (!trader_registry::is_verified_trader(trader_address)) {
            return RiskCheckResult {
                is_valid: false,
                risk_score: 10,
                max_allowed_amount: 0,
                warning_message: b"",
                rejection_reason: b"Trader not verified",
            }
        };

        // Check if trader is blacklisted
        if (vector::contains(&global_params.blacklisted_traders, &trader_address)) {
            return RiskCheckResult {
                is_valid: false,
                risk_score: 10,
                max_allowed_amount: 0,
                warning_message: b"",
                rejection_reason: b"Trader is blacklisted",
            }
        };

        // Check if symbol is allowed
        if (!is_symbol_allowed(&global_params.allowed_symbols, &symbol)) {
            return RiskCheckResult {
                is_valid: false,
                risk_score: 10,
                max_allowed_amount: 0,
                warning_message: b"",
                rejection_reason: b"Trading pair not allowed",
            }
        };

        // Get vault info
        let (vault_balance, locked_balance, daily_pnl, total_pnl, position_count) = 
            user_vault::get_vault_info(user_address);

        // Check position count limit
        if (position_count >= (user_profile.max_positions as u64)) {
            return RiskCheckResult {
                is_valid: false,
                risk_score: 8,
                max_allowed_amount: 0,
                warning_message: b"Maximum position count reached",
                rejection_reason: b"Too many open positions",
            }
        };

        // Check position size limits
        let available_balance = vault_balance - locked_balance;
        let max_position_amount = (vault_balance * (global_params.max_single_position_percentage as u64)) / 100;
        let user_max_position = user_profile.max_position_size;
        
        let effective_max = if (max_position_amount < user_max_position) {
            max_position_amount
        } else {
            user_max_position
        };

        if (amount > effective_max) {
            return RiskCheckResult {
                is_valid: false,
                risk_score: 7,
                max_allowed_amount: effective_max,
                warning_message: b"Position size too large",
                rejection_reason: b"Exceeds maximum position size",
            }
        };

        // Check daily loss limits
        let projected_daily_loss = user_profile.daily_loss_so_far + amount;
        if (projected_daily_loss > user_profile.max_daily_loss) {
            return RiskCheckResult {
                is_valid: false,
                risk_score: 9,
                max_allowed_amount: user_profile.max_daily_loss - user_profile.daily_loss_so_far,
                warning_message: b"Would exceed daily loss limit",
                rejection_reason: b"Daily loss limit exceeded",
            }
        };

        // Check available balance
        if (amount > available_balance) {
            return RiskCheckResult {
                is_valid: false,
                risk_score: 6,
                max_allowed_amount: available_balance,
                warning_message: b"Insufficient available balance",
                rejection_reason: b"Not enough funds",
            }
        };

        // Calculate risk score
        let risk_score = calculate_trade_risk_score(
            user_profile.risk_level,
            amount,
            vault_balance,
            position_count,
            trader_address
        );

        // All checks passed
        RiskCheckResult {
            is_valid: true,
            risk_score,
            max_allowed_amount: effective_max,
            warning_message: if (risk_score >= 7) { b"High risk trade" } else { b"" },
            rejection_reason: b"",
        }
    }

    // Calculate optimal position size based on risk level
    public fun calculate_position_size(
        user_address: address,
        trader_address: address,
        vault_balance: u64,
        trader_risk_score: u8
    ): u64 acquires UserRiskProfile {
        if (!exists<UserRiskProfile>(user_address)) {
            return 0
        };

        let user_profile = borrow_global<UserRiskProfile>(user_address);
        
        // Base allocation percentage based on risk level
        let base_percentage = if (user_profile.risk_level == 1) { 2 }      // Conservative: 2%
                             else if (user_profile.risk_level == 2) { 5 }  // Moderate: 5%
                             else if (user_profile.risk_level == 3) { 10 } // Balanced: 10%
                             else if (user_profile.risk_level == 4) { 15 } // Aggressive: 15%
                             else { 20 };                                  // Very Aggressive: 20%

        // Adjust based on trader risk score (1-10, lower is safer)
        let trader_adjustment = if (trader_risk_score <= 3) { 100 }        // +0%
                               else if (trader_risk_score <= 6) { 80 }     // -20%
                               else { 60 };                                // -40%

        let adjusted_percentage = (base_percentage * trader_adjustment) / 100;
        let calculated_amount = (vault_balance * adjusted_percentage) / 100;

        // Apply user's maximum position size limit
        if (calculated_amount > user_profile.max_position_size) {
            user_profile.max_position_size
        } else {
            calculated_amount
        }
    }

    // Check if stop loss should trigger
    public fun should_trigger_stop_loss(
        user_address: address,
        entry_price: u64,
        current_price: u64,
        is_long: bool
    ): bool acquires UserRiskProfile {
        if (!exists<UserRiskProfile>(user_address)) {
            return false
        };

        let user_profile = borrow_global<UserRiskProfile>(user_address);
        let stop_loss_percentage = user_profile.custom_limits.stop_loss_percentage;

        let price_change_percentage = if (is_long) {
            if (current_price <= entry_price) {
                ((entry_price - current_price) * 100) / entry_price
            } else { 0 }
        } else {
            if (current_price >= entry_price) {
                ((current_price - entry_price) * 100) / entry_price
            } else { 0 }
        };

        price_change_percentage >= (stop_loss_percentage as u64)
    }

    // Update daily loss tracking
    public fun update_daily_loss(user_address: address, loss_amount: u64) acquires UserRiskProfile {
        if (!exists<UserRiskProfile>(user_address)) {
            return
        };

        let user_profile = borrow_global_mut<UserRiskProfile>(user_address);
        reset_daily_limits_if_needed(user_profile);
        user_profile.daily_loss_so_far = user_profile.daily_loss_so_far + loss_amount;
    }

    // Emergency risk circuit breaker
    public fun emergency_risk_check(user_address: address): bool acquires UserRiskProfile {
        if (!exists<UserRiskProfile>(user_address)) {
            return true // Trigger emergency if no profile
        };

        let user_profile = borrow_global<UserRiskProfile>(user_address);
        let (vault_balance, locked_balance, daily_pnl, total_pnl, position_count) = 
            user_vault::get_vault_info(user_address);

        // Trigger emergency if:
        // 1. Daily loss exceeds 90% of limit
        // 2. Total account value drops by more than 50%
        // 3. Too many positions open
        
        let daily_loss_threshold = (user_profile.max_daily_loss * 90) / 100;
        let account_value_threshold = vault_balance / 2;
        
        (user_profile.daily_loss_so_far >= daily_loss_threshold) ||
        (total_pnl < -((account_value_threshold as i64))) ||
        (position_count >= (user_profile.max_positions as u64))
    }

    // Helper functions
    fun reset_daily_limits_if_needed(user_profile: &mut UserRiskProfile) {
        let today = get_today_timestamp();
        if (today > user_profile.daily_reset_timestamp) {
            user_profile.daily_loss_so_far = 0;
            user_profile.daily_reset_timestamp = today;
        };
    }

    fun get_today_timestamp(): u64 {
        let current_time = timestamp::now_seconds();
        // Reset at midnight UTC (86400 seconds = 1 day)
        (current_time / 86400) * 86400
    }

    fun get_max_leverage_for_risk_level(risk_level: u8): u8 {
        if (risk_level == 1) { 2 }      // Conservative: 2x
        else if (risk_level == 2) { 3 } // Moderate: 3x
        else if (risk_level == 3) { 5 } // Balanced: 5x
        else if (risk_level == 4) { 8 } // Aggressive: 8x
        else { 10 }                     // Very Aggressive: 10x
    }

    fun is_symbol_allowed(allowed_symbols: &vector<vector<u8>>, symbol: &vector<u8>): bool {
        vector::contains(allowed_symbols, symbol)
    }

    fun calculate_trade_risk_score(
        user_risk_level: u8,
        trade_amount: u64,
        vault_balance: u64,
        current_positions: u64,
        trader_address: address
    ): u8 {
        let position_percentage = (trade_amount * 100) / vault_balance;
        let position_risk = if (position_percentage > 15) { 3 }
                           else if (position_percentage > 10) { 2 }
                           else if (position_percentage > 5) { 1 }
                           else { 0 };

        let diversification_risk = if (current_positions == 0) { 2 }
                                  else if (current_positions < 3) { 1 }
                                  else { 0 };

        // Get trader risk from registry (simplified)
        let trader_risk = 2; // Would get from trader_registry in full implementation

        let base_risk = user_risk_level;
        let total_risk = base_risk + position_risk + diversification_risk + trader_risk;

        if (total_risk > 10) { 10 } else { total_risk }
    }

    // View functions
    #[view]
    public fun get_user_risk_profile(user_address: address): (u8, u64, u64, u8, u64) acquires UserRiskProfile {
        assert!(exists<UserRiskProfile>(user_address), error::not_found(E_RISK_LIMIT_EXCEEDED));
        let profile = borrow_global<UserRiskProfile>(user_address);
        (
            profile.risk_level,
            profile.max_daily_loss,
            profile.max_position_size,
            profile.max_positions,
            profile.daily_loss_so_far
        )
    }

    #[view]
    public fun get_allowed_symbols(): vector<vector<u8>> acquires RiskParameters {
        let params = borrow_global<RiskParameters>(@copy_trading);
        params.allowed_symbols
    }

    #[view]
    public fun is_trader_blacklisted(trader_address: address): bool acquires RiskParameters {
        let params = borrow_global<RiskParameters>(@copy_trading);
        vector::contains(&params.blacklisted_traders, &trader_address)
    }

    #[view]
    public fun risk_profile_exists(user_address: address): bool {
        exists<UserRiskProfile>(user_address)
    }
}
