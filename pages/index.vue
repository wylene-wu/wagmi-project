<template>
  <div class="flex justify-between gap-6">
    <div
      class="flex-[3_3_0px] py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px]"
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
      <div class="pt-10">
        <p class="text-[40px] font-bold">volume</p>
        <p class="text-[#7C7C7C] text-sm">$</p>
      </div>
    </div>
    <div
      class="flex-[1_1_0px] py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px]"
    >
      <p class="text-[25px]">APY</p>
      <p class="text-[40px] font-bold">10$</p>
    </div>
    <div
      class="flex-[3_3_0px] py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px]"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2.5 text-[25px] font-semibold">
          <img src="/imgs/ethereum.svg" class="w-8 h-8" />
          Ren Balance
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
      <p class="text-[30px] font-semibold">value</p>
    </div>
  </div>

  <div class="mt-10 bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px] p-6">
    <h2 class="text-2xl font-bold mb-4">Vault Information</h2>
    <div v-if="pending">Loading vault data...</div>
    <div v-else-if="error">Error loading vault data: {{ error.message }}</div>
    <div v-else-if="vaultData" class="grid grid-cols-3 gap-4">
      <div>
        <p class="text-gray-400">Name</p>
        <p class="text-xl font-semibold">{{ (vaultData as any).name }}</p>
      </div>
      <div>
        <p class="text-gray-400">Symbol</p>
        <p class="text-xl font-semibold">{{ (vaultData as any).symbol }}</p>
      </div>
      <div>
        <p class="text-gray-400">TVL</p>
        <p class="text-xl font-semibold">
          {{ (vaultData as any).totalValueLocked }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccount } from "@wagmi/vue";

const {
  data: vaultData,
  pending,
  error,
  refresh,
} = await useFetch("/api/vault");
</script>
