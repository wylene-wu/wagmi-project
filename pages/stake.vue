<template>
  <div class="">
    <h1 class="text-3xl font-bold mb-6">Stake</h1>

    <div class="bg-gray-800 px-6 py-8 rounded-[20px]">
      <h2 class="text-xl font-semibold mb-4">Staking Options</h2>
      <div class="space-y-6">
        <div class="p-4 bg-gray-700 rounded-lg">
          <div class="flex gap-[20%] items-center text-[20px] font-bold">
            <input
              type="text"
              class="flex-1 px-2 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            <label class="">Wallet Name</label>
          </div>

          <div class="flex p-2 justify-between text-[#B6BBBF]">
            <p>$</p>
            <div class="space-x-4">
              Balance: &nbsp;
              <button
                class="bg-[#A1DBFE] text-[#154E70] px-4 font-medium rounded-lg cursor-pointer"
              >
                Max
              </button>
            </div>
          </div>
        </div>
        <TransferIcon class="w-12 h-12 mx-auto rotate-90" />
        <h2 class="text-xl font-semibold mb-4">Receive</h2>
        <div class="p-4 bg-gray-700 rounded-lg">
          <div class="flex gap-[20%] items-center text-[20px] font-bold">
            <input
              type="text"
              class="flex-1 px-2 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
            <label class="">Token</label>
          </div>

          <p class="text-right text-[#B6BBBF] text-sm">Est: 24/09/25</p>
          <div class="flex p-2 justify-between text-[#B6BBBF] mt-4">
            <p>$</p>
            <div class="space-x-4">Balance: &nbsp;</div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="mt-6 w-full bg-white text-black rounded-xl text-[20px] font-medium py-3"
    >
      Stake
    </button>
    <div class="space-y-1 mt-8">
      <div class="flex justify-between">
        <p class="text-[#7C7C7C]">Exchange Rate</p>
        <p>1 ETH = 1000 Tokens</p>
      </div>
      <div class="flex justify-between">
        <p class="text-[#7C7C7C]">Fee</p>
        <p>1%</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TransferIcon } from "@/components/icons";
definePageMeta({
  layout: "default",
});
</script>
