import { defineEventHandler, getQuery, readBody } from "h3";

/**
 * @description Get vault information
 * @returns
 */
const getVaultInfo = () => {
  return {
    name: "Ethereum Vault",
    symbol: "ETH-VLT",
    totalSupply: "1000000",
    totalValueLocked: "5000000",
    apy: "8.5%",
    chain: "Ethereum",
    contractAddress: "0x1234567890123456789012345678901234567890",
    token: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
    },
    performance: {
      "1d": "0.02%",
      "7d": "0.15%",
      "30d": "0.65%",
    },
  };
};

export default defineEventHandler(async (event) => {
  const method = event.method;
  const query = getQuery(event);

  switch (method) {
    case "GET":
      return getVaultInfo();
    default:
      return {
        error: true,
        message: "Method not allowed",
      };
  }
});
