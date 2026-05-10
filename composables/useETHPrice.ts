"use client";

import { readContracts } from "@wagmi/core";

import { defaultChain, ethMainnet } from "@/config/constant";
import { formatUnits } from "viem";
import { ETHPriceAbi } from "@/contracts/abi/ethPrice";
import { config } from "@/wagmi";

export default function useETHPrice() {
  const runtimeConfig = useRuntimeConfig();
  const { PriceOracleETHAddress } = runtimeConfig.public;
  const price = ref<number | null>(null);

  const fetchETHPrice = async () => {
    const contracts = [
      {
        address: PriceOracleETHAddress as `0x${string}`,
        abi: ETHPriceAbi,
        functionName: "latestAnswer",
        args: [],
        chainId: ethMainnet.id,
      },
      {
        abi: ETHPriceAbi,
        address: PriceOracleETHAddress as `0x${string}`,
        args: [],
        functionName: "decimals",
        chainId: ethMainnet.id,
      },
    ];

    const [{ result: priceData }, { result: decimalsData }] =
      (await readContracts(config, {
        contracts,
      })) || [];

    price.value =
      priceData && decimalsData
        ? Number(formatUnits(priceData as bigint, decimalsData as number))
        : null;
  };

  onMounted(fetchETHPrice);

  return computed(() => price.value);
}
