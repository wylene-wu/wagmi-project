<script setup lang="ts">
import { ref, computed } from "vue";
import { WalletIcons } from "@/config/constant";
import type { WalletName } from "@/config/constant";
import { useChainId, useConnect, useDisconnect, useAccount } from "@wagmi/vue";

import { ToggleIcon, WalletIcon } from "@/components/icons";

const chainId = useChainId();
const { connect, connectors, status } = useConnect();
const { status: connectStatus, connector } = useAccount();
const isShowModal = ref(false);
const pendingConnectorId = ref<string | null>(null);

const isConnected = computed(() => connectStatus.value === "connected");
const isConnecting = computed(() => status.value === "pending");

const closeModal = () => {
  isShowModal.value = false;
  pendingConnectorId.value = null;
};

const openModal = () => {
  isShowModal.value = true;
};

const handleConnect = (connector: any) => {
  pendingConnectorId.value = connector.id;
  const chainIdValue = chainId.value;
  connect({ connector, chainId: chainIdValue });
};

watch(isConnected, (newIsConnected) => {
  if (newIsConnected && isShowModal.value) {
    isShowModal.value = false;
    pendingConnectorId.value = null;
  }
});
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center pb-[10%]">
    <p class="text-[25px] pb-7 text-[#F3F4F5]">
      <span class="text-[#A1DBFE] font-semibold">Welcome, &nbsp;</span>
      Get started for your portfolio
    </p>
    <button
      @click="openModal()"
      class="w-[70%] p-[30px] rounded-[20px] cursor-pointer shadow-[0_0_8px_#A1DBFE] border border-gray-400 bg-[#1C1C1C]"
    >
      <div class="flex gap-[30px] items-center">
        <WalletIcon class="w-12 h-12" />
        <div class="flex-1 text-left">
          <p class="text-[18px] font-semibold leading-loose">Connect Wallet</p>
          <p class="text-[#6B6B6B]">Connect Wallet to get started</p>
        </div>
        <ToggleIcon class="w-8 h-8" />
      </div>
    </button>
  </div>

  <Teleport to="body">
    <Transition
      v-if="isShowModal"
      name="modal"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-90"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-90"
      appear
      @click.self="isShowModal = false"
      class="text-black"
    >
      <div
        class="flex justify-center items-center bg-black/20 fixed inset-0 z-50"
      >
        <div
          class="p-10 py-12 rounded-[33px] bg-white relative min-w-[550px] shadow-2xl"
        >
          <div
            class="absolute right-10 top-6 cursor-pointer w-8 h-8 rounded-full flex justify-center items-center"
          >
            <img src="/imgs/close.svg" class="" @click="closeModal" />
          </div>
          <p class="font-bold text-2xl pb-8">Choose a wallet</p>
          <div class="flex flex-col rounded-2xl">
            <div
              v-for="c in connectors.filter((i) => i.name !== 'Injected')"
              :key="c.id"
              type="button"
              :class="[
                'cursor-pointer flex gap-2 items-center p-4 px-6 rounded-lg bg-white border border-transparent hover:bg-[#A1DBFE]/20  hover:border-[#A1DBFE] ',
                'transition-colors duration-200',
              ]"
              @click="handleConnect(c)"
            >
              <img
                :src="c.icon || WalletIcons[c.name as WalletName] || ''"
                class="w-8 h-8"
                alt="Wallet icon"
              />
              <div class="font-bold">{{ c.name }}</div>
              <div v-if="c.id === connector?.id" class="ml-auto text-green-500">
                Connected
              </div>
              <div
                v-else-if="isConnecting && c.id === pendingConnectorId"
                class="ml-auto text-[#A1DBFE]"
              >
                Connecting...
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
