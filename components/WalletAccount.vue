<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useAccount, useDisconnect } from "@wagmi/vue";
import { Chains } from "@/config/constant";
import { formatAddress } from "@/utils/wallet";

const ActionsArrays = [
  {
    name: "Copy address",
    iconPath: "/imgs/copyaddress.svg",
  },
  {
    name: "Disconnect",
    iconPath: "/imgs/disconnectwallet.svg",
  },
];

const { disconnect } = useDisconnect();
const { status: connectStatus, address, chain } = useAccount();
const toast = useToast();
const isShowModal = ref(false);
const isConnected = computed(() => connectStatus.value === "connected");

const openModal = () => {
  isShowModal.value = !isShowModal.value;
};

const closeModal = () => {
  isShowModal.value = false;
};

const handleCopyAddress = async () => {
  if (!address.value) return;
  await navigator.clipboard.writeText(address.value);
  toast.success("Copy address success");
  closeModal();
};

const handleDisconnect = () => {
  disconnect();
  closeModal();
};

watch(isConnected, (newIsConnected) => {
  if (newIsConnected && isShowModal.value) {
    isShowModal.value = false;
  }
});
</script>

<template>
  <div class="relative">
    <button
      v-if="isConnected"
      type="button"
      :aria-expanded="isShowModal"
      aria-haspopup="menu"
      @click="openModal"
      class="group flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-full border border-accent/25 bg-surface/90 px-3 py-2 text-left shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_8%,transparent)] outline-none backdrop-blur-xl transition duration-200 hover:border-accent/60 hover:bg-accent/10 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:px-4"
    >
      <span
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-mint/20 bg-mint/10"
      >
        <img
          v-if="chain?.icon"
          :src="chain.icon"
          class="h-4 w-4"
          :alt="`${chain.name || 'Current chain'} icon`"
        />
        <span v-else class="h-2 w-2 rounded-full bg-mint-text" />
      </span>
      <span class="block text-sm font-semibold leading-5 text-white">
        {{ formatAddress(address) }}
      </span>
      <img
        src="/imgs/arrowbottom.svg"
        class="h-3 w-3 shrink-0 transition duration-200 group-hover:translate-y-0.5"
        alt=""
      />
    </button>
    <Transition
      name="modal"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1 scale-95"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-1 scale-95"
      appear
    >
      <div
        v-if="isShowModal"
        class="absolute right-0 top-[calc(100%+12px)] z-50 w-[280px] overflow-hidden rounded-[24px] border border-accent/20 bg-panel p-3 text-white shadow-[0_28px_90px_rgba(0,0,0,0.48),0_0_42px_color-mix(in_srgb,var(--color-mint)_12%,transparent)] backdrop-blur-xl"
        role="menu"
        @keydown.esc="closeModal"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_38%),radial-gradient(circle_at_bottom_right,color-mix(in_srgb,var(--color-mint)_10%,transparent),transparent_32%)]"
        />
        <div
          class="relative rounded-2xl border border-white/10 bg-white/[0.04] p-3"
        >
          <p class="text-xs font-semibold uppercase text-subtle">
            Connected wallet
          </p>
          <p class="pt-1 text-sm font-semibold text-white">
            {{ formatAddress(address) }}
          </p>
        </div>

        <div class="relative mt-3">
          <p class="px-2 pb-2 text-xs font-semibold uppercase text-subtle">
            Supported chains
          </p>
          <div
            v-for="c in Chains"
            :key="c.id"
            :class="[
              'flex min-h-11 w-full items-center gap-2.5 rounded-2xl border px-3 py-2 text-left transition duration-200',
              c.id === chain?.id
                ? 'border-mint/70 bg-mint/10 text-mint-text'
                : 'border-transparent text-soft',
            ]"
          >
            <img :src="c.icon" class="h-5 w-5 rounded-full bg-white" alt="" />
            <span class="text-sm font-medium">{{ c.name }}</span>
            <span
              v-if="c.id === chain?.id"
              class="ml-auto rounded-full bg-mint/15 px-2 py-0.5 text-xs font-semibold text-mint-text"
            >
              Active
            </span>
          </div>
        </div>

        <div class="relative mt-3 border-t border-white/10 pt-3">
          <p class="px-2 pb-2 text-xs font-semibold uppercase text-subtle">
            Actions
          </p>
          <template v-for="{ name, iconPath } in ActionsArrays" :key="name">
            <button
              type="button"
              class="flex min-h-11 w-full cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2 text-left text-soft transition duration-200 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              @click="
                name === 'Copy address'
                  ? handleCopyAddress()
                  : handleDisconnect()
              "
            >
              <img :src="iconPath" class="h-5 w-5" alt="" />
              <span class="text-sm font-medium">{{ name }}</span>
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>
