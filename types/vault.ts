export type VaultData = {
  id: string;
  chain_id: number;
  address: `0x${string}`;
  symbol: string;
  decimals: number;
  name: string;
  withdraw_avg_time_seconds: number;
  collector: `0x${string}`;
  price: number;
  apr: number;
  tvl_usd: number;
  tvl_base_token: string;
  limit_usd: number;
  limit_base_token: string;
  total_supply: string;
};

export type PointsData = {
  chain_id: number;
  timestamp: number;
  user_address: string;
  user_mellow_points: string;
  user_merits_points: string;
  user_referal_points: string;
  user_symbiotic_points: string;
  user_vault_balance: string;
  vault_address: string;
};
