<script setup lang="ts">
import { ref, computed, unref, watch } from "vue";
import { WalletIcons } from "@/config/constant";
import type { WalletName } from "@/config/constant";
import { useChainId, useConnect, useAccount } from "@wagmi/vue";

import { ToggleIcon, WalletIcon } from "@/components/icons";

const chainId = useChainId();
const { connect, connectors, status } = useConnect();
const { status: connectStatus, connector } = useAccount();
const isShowModal = ref(false);
const pendingConnectorId = ref<string | null>(null);

const isConnected = computed(() => connectStatus.value === "connected");
const isConnecting = computed(() => status.value === "pending");
const connectorList = computed(() => unref(connectors) || []);
const availableConnectors = computed(() =>
  connectorList.value.filter((item) => item.name !== "Injected"),
);
const selectedConnectorName = computed(() => connector.value?.name || "Wallet");

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
  <div
    class="relative flex h-full min-h-[460px] w-full flex-col items-center justify-center overflow-hidden px-5 pb-[10%]"
  >
    <div
      class="pointer-events-none absolute inset-x-8 top-1/2 h-40 -translate-y-1/2 rounded-full bg-mint/10 blur-3xl"
    />
    <p
      class="relative max-w-[720px] pb-7 text-center text-[22px] leading-tight text-text sm:text-[25px]"
    >
      <span class="font-semibold text-accent">Connect on-chain, </span>
      <span> Get started for your portfolio</span>
    </p>
    <button
      type="button"
      :aria-expanded="isShowModal"
      aria-haspopup="dialog"
      @click="openModal"
      class="group relative w-full max-w-[720px] overflow-hidden rounded-3xl border border-accent/20 bg-surface/90 p-5 text-left shadow-[0_22px_80px_rgba(0,0,0,0.32),0_0_34px_color-mix(in_srgb,var(--color-mint)_12%,transparent)] outline-none backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-accent/55 hover:shadow-[0_24px_90px_rgba(0,0,0,0.38),0_0_42px_color-mix(in_srgb,var(--color-accent)_18%,transparent)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg sm:p-6"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--color-mint)_10%,transparent),transparent_45%)]"
      />
      <div class="relative flex items-center gap-4 sm:gap-5">
        <span
          class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/30"
        >
          <WalletIcon class="h-8 w-8" />
        </span>
        <div class="min-w-0 flex-1 space-y-3">
          <p class="text-[19px] font-semibold leading-7 text-white">
            {{ isConnected ? selectedConnectorName : "Connect Wallet" }}
          </p>
          <p class="text-sm leading-6 text-muted sm:text-base">
            {{
              isConnected
                ? "Wallet linked. Open to switch provider or verify status."
                : "Connect a wallet to view balances, positions, and activity."
            }}
          </p>
        </div>
        <ToggleIcon
          class="h-8 w-8 shrink-0 text-accent transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
    </button>
  </div>

  <Teleport to="body">
    <Transition
      name="modal"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
      appear
    >
      <div
        v-if="isShowModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-overlay/75 px-4 py-6 backdrop-blur-md"
        @click.self="closeModal"
        @keydown.esc="closeModal"
      >
        <div
          class="relative w-full max-w-[560px] overflow-hidden rounded-[28px] border border-accent/20 bg-panel p-6 text-white shadow-[0_28px_120px_rgba(0,0,0,0.56),0_0_52px_color-mix(in_srgb,var(--color-mint)_14%,transparent)] sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="connect-wallet-title"
        >
          <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_34%),radial-gradient(circle_at_bottom_right,--color-mix(in_srgb,var(--color-mint)_12%,transparent),transparent_30%)]"
          />
          <button
            type="button"
            aria-label="Close wallet selection"
            class="absolute right-5 top-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 transition duration-200 hover:bg-accent/10 hover:border-accent/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-6 sm:top-6"
            @click="closeModal"
          >
            <img src="/imgs/close.svg" class="h-4 w-4 invert" alt="" />
          </button>
          <div class="relative pr-12">
            <p
              id="connect-wallet-title"
              class="pb-2 text-2xl font-bold leading-tight text-white"
            >
              Choose a wallet
            </p>
            <p class="pb-10 text-sm leading-6 text-muted">
              Select a provider to authorize this dApp.
            </p>
          </div>
          <div class="relative flex flex-col gap-3 rounded-2xl">
            <button
              v-for="c in availableConnectors"
              :key="c.id"
              type="button"
              :class="[
                'flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-2xl border p-4 px-5 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-wait disabled:opacity-80',
                c.id === connector?.id
                  ? 'border-mint/70 bg-mint/10'
                  : 'border-white/10 bg-white/4 hover:border-accent/55 hover:bg-accent/10',
              ]"
              :disabled="isConnecting && c.id === pendingConnectorId"
              @click="handleConnect(c)"
            >
              <img
                :src="c.icon || WalletIcons[c.name as WalletName] || ''"
                class="h-9 w-9 shrink-0 rounded-full bg-white"
                :alt="`${c.name} icon`"
              />
              <span class="min-w-0 flex-1">
                <span class="block font-bold text-white">{{ c.name }}</span>
                <span class="block text-xs leading-5 text-subtle">
                  Browser wallet provider
                </span>
              </span>
              <span
                v-if="c.id === connector?.id"
                class="ml-auto rounded-full bg-mint/15 px-3 py-1 text-xs font-semibold text-mint-text"
              >
                Connected
              </span>
              <span
                v-else-if="isConnecting && c.id === pendingConnectorId"
                class="ml-auto rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent"
              >
                Connecting...
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
