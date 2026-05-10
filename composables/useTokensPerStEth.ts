"use client";

import { useAccount, useReadContract } from "@wagmi/vue";

import { defaultChain } from "@/config/constant";
import { wstETHAbi } from "@/contracts/abi/wstETH";
import { formatUnits } from "viem";

export default function useTokensPerStEth() {
  const runtimeConfig = useRuntimeConfig();
  const { address, chain, chainId } = useAccount();
  const enabled = chainId.value === defaultChain.id && !!address.value;
  const { WstETHAddress } = runtimeConfig.public;
  const { data } = useReadContract({
    address: WstETHAddress as `0x${string}`,
    abi: wstETHAbi,
    functionName: "tokensPerStEth",
    args: [],
    account: address.value,
  });

  return computed(() =>
    data?.value
      ? formatDisplayDecimal(formatUnits((data?.value as bigint) ?? 0n, 18), 4)
      : "",
  );
}
