<template>
  <div class="flex justify-between gap-6">
    <div
      class="flex-3 flex justify-between flex-col gap-6 py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px]"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2.5 text-[25px] font-semibold">
          <img src="/imgs/ethereum.svg" class="w-8 h-8" />
          Balance
        </div>
        <button class="bg-white text-black rounded-full px-4 py-1 font-medium">
          Stake
        </button>
      </div>
      <div class="">
        <p class="text-[40px] font-bold">volume</p>
        <p class="text-[#7C7C7C] text-sm">$</p>
      </div>
    </div>
    <div
      class="flex-1 flex justify-between flex-col gap-6 py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px]"
    >
      <p class="text-[25px]">APY</p>
      <p class="text-[40px] font-bold">{{ vaultData?.apr || "_" }}%</p>
    </div>
    <div
      class="flex-3 flex justify-between flex-col gap-6 py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px]"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2.5 text-[25px] font-semibold">
          <img src="/imgs/ethereum.svg" class="w-8 h-8" />
          {{ vaultData?.symbol || "_" }}
        </div>
        <button class="bg-white text-black rounded-full px-4 py-1 font-medium">
          Unstake
        </button>
      </div>
      <div class="">
        <p class="text-[40px] font-bold">volume</p>
        <p class="text-[#7C7C7C] text-sm">$</p>
      </div>
    </div>
  </div>
  <div class="mt-10 flex justify-between gap-12">
    <div
      v-for="value in ['mellow', 'symbiotic']"
      class="py-[25px] px-[30px] flex-1 flex flex-col gap-8 justify-between bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px]"
    >
      <p class="text-[20px] font-medium">{{ value }}</p>
      <p class="text-[30px] font-semibold">
        {{
          value === "mellow"
            ? pointsData?.user_mellow_points
            : pointsData?.user_symbiotic_points || "_"
        }}
      </p>
    </div>
  </div>

  <div class="mt-10 bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px] p-6">
    <h2 class="text-2xl font-bold mb-4">Vault Information</h2>

    <div class="grid grid-cols-3 gap-4">
      <div>
        <p class="text-gray-400">Name</p>
        <p class="text-xl font-semibold">{{ vaultData?.name || "_" }}</p>
      </div>
      <div>
        <p class="text-gray-400">Symbol</p>
        <p class="text-xl font-semibold">{{ vaultData?.symbol || "_" }}</p>
      </div>
      <div>
        <p class="text-gray-400">TVL</p>
        <p class="text-xl font-semibold">
          {{ vaultData?.tvl_usd ? vaultData.tvl_usd : "_" }}
          USD
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PointsData, VaultData } from "@/types/vault";
import { useAccount } from "@wagmi/vue";
import { computed, watch } from "vue";

const { address } = useAccount();
const addressParam = computed(() => address.value || "");

const { data: vaultData } = await useFetch<VaultData>("/api/vault");
const { data: pointsData, refresh: pointsRefresh } = await useFetch<PointsData>(
  "/api/vault/points",
  {
    params: {
      address: addressParam,
    },
    immediate: false,
  }
);

watch(
  address,
  (newAddress) => {
    if (newAddress) {
      pointsRefresh();
    }
  },
  { immediate: true }
);
</script>
