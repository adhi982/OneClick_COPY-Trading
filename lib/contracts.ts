// Contract addresses and configuration for OneClick Copy Trading

// Get contract address from environment variables
const getContractAddress = () => {
  if (typeof window !== 'undefined') {
    // Frontend environment
    return process.env.NEXT_PUBLIC_COPY_TRADING_CONTRACT || "0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260";
  } else {
    // Backend environment
    const network = process.env.APTOS_NETWORK || 'testnet';
    return network === 'mainnet' 
      ? process.env.COPY_TRADING_CONTRACT_ADDRESS_MAINNET 
      : process.env.COPY_TRADING_CONTRACT_ADDRESS_TESTNET || "0x84f085ed525338169913c521f1a051caab262bd010d38d55869232ddede92260";
  }
};

// The main contract address (deployed account address)
export const CONTRACT_ADDRESS = getContractAddress();

// Module names
export const MODULES = {
  MAIN: "main",
  USER_VAULT: "user_vault", 
  TRADER_REGISTRY: "trader_registry",
  RISK_MANAGER: "risk_manager"
} as const;

// Full module identifiers
export const MODULE_ADDRESSES = {
  MAIN: `${CONTRACT_ADDRESS}::${MODULES.MAIN}`,
  USER_VAULT: `${CONTRACT_ADDRESS}::${MODULES.USER_VAULT}`,
  TRADER_REGISTRY: `${CONTRACT_ADDRESS}::${MODULES.TRADER_REGISTRY}`,
  RISK_MANAGER: `${CONTRACT_ADDRESS}::${MODULES.RISK_MANAGER}`
} as const;

// Function entry points
export const ENTRY_FUNCTIONS = {
  // Main module functions
  CREATE_VAULT: `${MODULE_ADDRESSES.MAIN}::create_vault`,
  REGISTER_TRADER: `${MODULE_ADDRESSES.MAIN}::register_trader`,
  EXECUTE_COPY_TRADE: `${MODULE_ADDRESSES.MAIN}::execute_copy_trade`,
  
  // User vault functions
  DEPOSIT: `${MODULE_ADDRESSES.USER_VAULT}::deposit`,
  WITHDRAW: `${MODULE_ADDRESSES.USER_VAULT}::withdraw`,
  OPEN_POSITION: `${MODULE_ADDRESSES.USER_VAULT}::open_position`,
  CLOSE_POSITION: `${MODULE_ADDRESSES.USER_VAULT}::close_position`,
  GET_VAULT_BALANCE: `${MODULE_ADDRESSES.USER_VAULT}::get_vault_balance`,
  
  // Trader registry functions
  REGISTER_AS_TRADER: `${MODULE_ADDRESSES.TRADER_REGISTRY}::register_trader`,
  VERIFY_TRADER: `${MODULE_ADDRESSES.TRADER_REGISTRY}::verify_trader`,
  UPDATE_TRADER_STATS: `${MODULE_ADDRESSES.TRADER_REGISTRY}::update_trader_stats`,
  GET_TRADER_PROFILE: `${MODULE_ADDRESSES.TRADER_REGISTRY}::get_trader_profile`,
  
  // Risk manager functions
  VALIDATE_TRADE: `${MODULE_ADDRESSES.RISK_MANAGER}::validate_trade`,
  CHECK_PORTFOLIO_RISK: `${MODULE_ADDRESSES.RISK_MANAGER}::check_portfolio_risk`,
  UPDATE_RISK_SETTINGS: `${MODULE_ADDRESSES.RISK_MANAGER}::update_risk_settings`
} as const;

// View functions (read-only)
export const VIEW_FUNCTIONS = {
  GET_VAULT_BALANCE: `${MODULE_ADDRESSES.USER_VAULT}::get_vault_balance`,
  GET_VAULT_STATS: `${MODULE_ADDRESSES.USER_VAULT}::get_vault_stats`,
  GET_TRADER_PROFILE: `${MODULE_ADDRESSES.TRADER_REGISTRY}::get_trader_profile`,
  GET_TRADER_STATS: `${MODULE_ADDRESSES.TRADER_REGISTRY}::get_trader_stats`,
  IS_POSITION_AT_RISK: `${MODULE_ADDRESSES.RISK_MANAGER}::is_position_at_risk`,
  GET_RISK_PROFILE: `${MODULE_ADDRESSES.RISK_MANAGER}::get_risk_profile`
} as const;

// Type definitions for contract interactions
export interface CreateVaultArgs {
  initial_deposit: string; // u64 as string
  max_daily_loss: string; // u64 as string
  max_position_size: string; // u64 as string
}

export interface RegisterTraderArgs {
  display_name: string;
  performance_fee: string; // u64 as string (percentage in basis points)
  min_followers: string; // u64 as string
}

export interface ExecuteCopyTradeArgs {
  trader_address: string;
  symbol: string;
  amount: string; // u64 as string
  price: string; // u64 as string
  is_long: boolean;
}

export interface OpenPositionArgs {
  trader_address: string;
  symbol: string;
  amount: string; // u64 as string
  entry_price: string; // u64 as string
  is_long: boolean;
}

export interface ClosePositionArgs {
  position_id: string; // u64 as string
  exit_price: string; // u64 as string
}

export interface DepositArgs {
  amount: string; // u64 as string
}

export interface WithdrawArgs {
  amount: string; // u64 as string
}

// Contract deployment info
export const DEPLOYMENT_INFO = {
  NETWORK: "testnet",
  CONTRACT_ADDRESS,
  DEPLOYED_AT: new Date().toISOString(),
  COMPILED_WITH: "aptos-cli-v4.2.5",
  PACKAGE_SIZE: "25342 bytes"
} as const;
