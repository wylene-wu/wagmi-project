<script setup lang="ts">
import { ref, computed } from "vue";
import { useAccount, useDisconnect } from "@wagmi/vue";
import { Chains } from "@/config/constant";
import { formatAddress } from "@/utils/wallet";

const { disconnect } = useDisconnect();
const { status: connectStatus, address, chain } = useAccount();
const isShowModal = ref(false);
const isConnected = computed(() => connectStatus.value === "connected");

const openModal = () => {
  isShowModal.value = !isShowModal.value;
};

watch(isConnected, (newIsConnected) => {
  if (newIsConnected && isShowModal.value) {
    isShowModal.value = false;
  }
});
</script>

<template>
  <div class="relative">
    <div
      v-if="isConnected"
      @click="openModal"
      class="border border-[#C9793F] rounded-full px-4 py-2.5 cursor-pointer bg-[#0A0A0A] flex justify-between"
    >
      <p class="font-medium text-sm">{{ formatAddress(address) }}</p>
      <div v-if="chain?.icon" class="flex items-center gap-2.5">
        <img :src="chain.icon" />
        <img src="/imgs/arrowbottom.svg" />
      </div>
    </div>
    <Transition
      v-if="isShowModal"
      name="modal"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 "
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      appear
      @click.self="isShowModal = false"
      class="bg-[#373737] absolute top-[110%] left-0 w-full"
    >
      <div class="flex flex-col shadow-2xl rounded-2xl">
        <p class="py-2.5 px-3">CHOOSE CHAIN</p>
        <div
          v-for="c in Chains"
          :key="c.id"
          :class="[
            'cursor-pointer flex items-center gap-2.5 py-2.5 px-3 hover:bg-[#A1DBFE]/20',
            c.id === chain?.id ? 'bg-[#A1DBFE] hover:bg-[#A1DBFE]' : '',
          ]"
        >
          <img :src="c.icon" class="w-5 h-5" />
          <p>{{ c.name }}</p>
        </div>
        <p class="py-2.5 px-3">OTHER</p>
        <div
          class="cursor-pointer flex items-center gap-2.5 py-2.5 px-3 hover:bg-[#A1DBFE]/20"
        >
          <img src="/imgs/copyaddress.svg" class="w-5 h-5" />
          <p>Copy</p>
        </div>
        <div
          class="cursor-pointer flex items-center gap-2.5 py-2.5 px-3 hover:bg-[#A1DBFE]/20"
          @click="disconnect()"
        >
          <img src="/imgs/disconnectwallet.svg" class="w-5 h-5" />
          <p>Disconnect</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
