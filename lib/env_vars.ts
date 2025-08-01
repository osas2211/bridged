export const env_vars = {
  THIRD_WEB_CLIENT_ID:
    process.env.THIRD_WEB_CLIENT_ID ||
    process.env.NEXT_PUBLIC_THIRD_WEB_CLIENT_ID!,
  THIRD_WEB_SECRET_KEY:
    process.env.THIRD_WEB_SECRET_KEY ||
    process.env.NEXT_PUBLIC_THIRD_WEB_SECRET_KEY!,
  SEPOLIA_CHAIN_ID:
    Number(process.env.SEPOLIA_CHAIN_ID) ||
    Number(process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID!),
  SEPOLIA_RPC: process.env.SEPOLIA_RPC || process.env.NEXT_PUBLIC_SEPOLIA_RPC!,
  TRON_CHAIN_ID:
    Number(process.env.TRON_CHAIN_ID) ||
    Number(process.env.NEXT_PUBLIC_TRON_CHAIN_ID!),
  TRON_RPC: process.env.TRON_RPC || process.env.NEXT_PUBLIC_TRON_RPC!,
}
