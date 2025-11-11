<script setup lang="ts">
import { ref, computed } from "vue";
import { WalletIcons } from "@/config/constant";
import type { WalletName } from "@/config/constant";
import { useChainId, useConnect, useDisconnect, useAccount } from "@wagmi/vue";

const chainId = useChainId();
const { disconnect } = useDisconnect();
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
  <button
    @click="isConnected ? disconnect() : openModal()"
    class="px-4 py-2 rounded-lg cursor-pointer border border-gray-400"
  >
    {{ isConnected ? "Disconnect" : "Connect Wallet" }}
  </button>

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
          class="p-8 py-12 rounded-[33px] bg-white relative min-w-[520px] shadow-2xl"
        >
          <img
            src="/imgs/close.svg"
            class="absolute right-4 top-4 cursor-pointer"
            @click="closeModal"
          />
          <div>
            <p class="font-bold text-2xl pb-4">Choose a wallet</p>
            <div class="flex flex-col rounded-2xl">
              <div
                v-for="c in connectors.filter((i) => i.name !== 'Injected')"
                :key="c.id"
                type="button"
                :class="[
                  'cursor-pointer flex gap-2 items-center p-4 px-6 rounded-lg hover:bg-amber-100/20 border border-amber-100/20 hover:border hover:border-amber-200',
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
                <div
                  v-if="c.id === connector?.id"
                  class="ml-auto text-green-500"
                >
                  Connected
                </div>
                <div
                  v-else-if="isConnecting && c.id === pendingConnectorId"
                  class="ml-auto text-blue-500"
                >
                  Connecting...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
