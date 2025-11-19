import { defineEventHandler, getQuery } from "h3";
import { VaultAddress } from "~/config/constant";
import { PointsData } from "~/types/vault";

const baseUrl = "https://points.mellow.finance/v1";

const getPointsInfo = async (addr: string) => {
  try {
    const apiUrl = `${baseUrl}/users/${addr}`;

    const data = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response.json() as Promise<PointsData[]>);

    if (!data) {
      throw new Error(`HTTP error!`);
    }

    return data?.filter((i) => i.vault_address === VaultAddress)[0];
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
  const query = getQuery(event);
  const addr = (query.address as string) || "";

  switch (method) {
    case "GET":
      return await getPointsInfo(addr);
    default:
      return {
        error: true,
        message: "Method not allowed",
      };
  }
});
