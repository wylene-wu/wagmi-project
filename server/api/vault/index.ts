import { defineEventHandler, getQuery, getRequestURL } from "h3";
import { VaultAddress } from "~/config/constant";
import { VaultData } from "~/types/vault";

const baseUrl = "https://points.mellow.finance/v1";

const getVaultInfo = async () => {
  try {
    const apiUrl = `${baseUrl}/vaults`;

    const data = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json() as Promise<VaultData[]>);

    if (!data) {
      throw new Error(`HTTP error!`);
    }

    return data?.filter(
      (i) =>
        i.address?.toLocaleLowerCase() === VaultAddress?.toLocaleLowerCase()
    )[0];
  } catch (error: any) {
    console.error("Error fetching vault info:", error);
    return {
      error: true,
      message: "Failed to fetch vault information",
      details: error.message || "Unknown error",
    };
  }
};

export default defineEventHandler(async (event) => {
  const method = event.method;

  switch (method) {
    case "GET":
      return await getVaultInfo();
    default:
      return {
        error: true,
        message: "Method not allowed",
      };
  }
});
