"use client";

import { readContracts } from "@wagmi/core";
import { useAccount } from "@wagmi/vue";
import { formatUnits, parseUnits } from "viem";
import { computed, onMounted, ref } from "vue";

import { defaultChain, ethMainnet } from "@/config/constant";
import { ERC20Abi } from "@/contracts/abi/erc20";
import { MulticallAbi } from "@/contracts/abi/multicall";
import { config } from "@/wagmi";

export default function useWalletBalance() {
  const runtimeConfig = useRuntimeConfig();
  const { address, chain, chainId } = useAccount();
  const enabled = chainId.value === defaultChain.id && !!address.value;
  const balances = ref<
    Record<
      "ETH" | "stETH" | "wstETH",
      { symbol: string; balance: string; value: bigint } | undefined
    >
  >({ ETH: undefined, stETH: undefined, wstETH: undefined });
  const loading = ref(false);

  const ethBalance = computed(() => balances.value.ETH);
  const stethBalance = computed(() => balances.value.stETH);
  const wstethBalance = computed(() => balances.value.wstETH);

  const { MultiCallAddress, StETHAddress, WstETHAddress } =
    runtimeConfig.public;

  const fetchBalances = async () => {
    loading.value = true;
    const contracts = enabled
      ? [
          {
            address: MultiCallAddress as `0x${string}`,
            abi: MulticallAbi,
            functionName: "getEthBalance",
            args: [address.value],
          },
          {
            abi: ERC20Abi,
            address: StETHAddress as `0x${string}`,
            args: [address.value],
            functionName: "balanceOf",
            chainId: defaultChain.id,
          },
          {
            address: WstETHAddress as `0x${string}`,
            abi: ERC20Abi,
            args: [address.value],
            functionName: "balanceOf",
            chainId: defaultChain.id,
          },
          {
            abi: ERC20Abi,
            address: StETHAddress as `0x${string}`,
            args: [],
            functionName: "symbol",
            chainId: defaultChain.id,
          },
          {
            abi: ERC20Abi,
            address: WstETHAddress as `0x${string}`,
            args: [],
            functionName: "symbol",
            chainId: defaultChain.id,
          },
        ]
      : [];

    const [ethBalance, stethBalance, wstethBalance, stethSymbol, wstethSymbol] =
      (await readContracts(config, {
        contracts,
      })) || [];

    balances.value = {
      ETH: {
        symbol: "ETH",
        balance: ethBalance?.result
          ? formatDisplayDecimal(formatUnits(ethBalance.result as bigint, 18))
          : "",
        value: ethBalance?.result as bigint,
      },
      stETH: {
        symbol: stethSymbol?.result as string,
        balance: stethBalance?.result
          ? formatDisplayDecimal(
              formatUnits(stethBalance?.result as bigint, 18),
            )
          : "",
        value: stethBalance?.result as bigint,
      },
      wstETH: {
        symbol: wstethSymbol?.result as string,
        balance: wstethBalance?.result
          ? formatDisplayDecimal(
              formatUnits(wstethBalance?.result as bigint, 18),
            )
          : "",
        value: wstethBalance?.result as bigint,
      },
    };
    loading.value = false;
  };

  onMounted(fetchBalances);

  watch(
    () => [address.value, chainId.value],
    () => {
      if (enabled) {
        fetchBalances();
      } else {
        balances.value = {
          ETH: undefined,
          stETH: undefined,
          wstETH: undefined,
        };
      }
    },
  );

  return {
    refetchBalances: fetchBalances,
    loading,
    ethBalance,
    stethBalance,
    wstethBalance,
  };
}
