<template>
  <div class="flex justify-between gap-6 flex-wrap">
    <div
      class="flex-1 md:flex-3 py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px] flex flex-col justify-between gap-10"
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
      <div>
        <p class="text-[40px] font-bold">volume</p>
        <p class="text-[#7C7C7C] text-sm">$</p>
      </div>
    </div>
    <div
      class="flex-1 py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px] flex flex-col justify-between"
    >
      <p class="text-[25px]">APY</p>
      <p class="text-[40px] font-bold">10$</p>
    </div>
    <div
      class="flex-1 md:flex-3 py-[25px] px-[30px] bg-[#1C1C1C] shadow-[0_0_8px_#A1DBFE] rounded-[20px] flex flex-col justify-between gap-10"
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
</template>

<script setup lang="ts">
import { useAccount } from "@wagmi/vue";
import { computed } from "vue";
import Connect from "@/components/Connect.vue";
import Account from "@/components/Account.vue";

const { status } = useAccount();
const isConnected = computed(() => status.value === "connected");
</script>
