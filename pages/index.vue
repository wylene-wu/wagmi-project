<template>
  <div class="relative space-y-8 overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-8 top-10 h-48 rounded-full bg-mint/10 blur-3xl"
    />

    <section
      class="relative overflow-hidden rounded-[28px] border border-accent/20 bg-panel p-6 shadow-[0_28px_120px_rgba(0,0,0,0.42),0_0_52px_color-mix(in_srgb,var(--color-mint)_12%,transparent)] sm:p-8"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_34%),linear-gradient(135deg,color-mix(in_srgb,var(--color-mint)_8%,transparent),transparent_44%)]"
      />
      <div
        class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
      >
        <div class="max-w-2xl">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
            >
              Vault dashboard
            </span>
            <span
              class="rounded-full border border-mint/20 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint-text"
            >
              On-chain ready
            </span>
          </div>
          <h1
            class="mt-4 text-3xl font-bold leading-tight text-text sm:text-4xl"
          >
            Ascend portfolio overview
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
            Monitor vault performance, staking exposure, and points.
          </p>
        </div>

        <div
          class="rounded-2xl border border-white/10 bg-white/[0.04] p-4 lg:min-w-[220px]"
        >
          <p class="text-xs font-semibold uppercase text-subtle">Vault APY</p>
          <p class="mt-2 text-2xl font-bold text-accent">
            {{ vaultData?.apr ? (vaultData.apr * 100).toFixed(2) + "%" : "_" }}
          </p>
        </div>
      </div>
    </section>

    <section class="grid gap-5 lg:grid-cols-7">
      <div
        class="group relative overflow-hidden rounded-[24px] border border-accent/20 bg-surface/90 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.28),0_0_34px_color-mix(in_srgb,var(--color-mint)_10%,transparent)] backdrop-blur-xl lg:col-span-3"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent_38%)]"
        />
        <div class="relative flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10"
            >
              <img src="/imgs/ethereum.svg" class="h-7 w-7" alt="Ethereum" />
            </span>
            <div>
              <p class="text-sm font-semibold text-subtle">ETH balance</p>
              <p class="mt-1 text-sm text-muted">Available to stake</p>
            </div>
          </div>
          <NuxtLink
            to="/stake"
            :class="[
              'rounded-full border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              ethBalance?.balance && ethBalance.balance !== '-'
                ? 'hover:border-accent/55 hover:bg-accent/15 cursor-pointer'
                : 'opacity-50 cursor-not-allowed',
            ]"
            :disabled="!ethBalance?.balance"
          >
            Stake
          </NuxtLink>
        </div>
        <div class="relative mt-8">
          <p class="text-4xl font-bold text-white">
            {{ ethBalance?.balance || "_" }}
          </p>
          <p class="mt-2 text-sm text-muted">$ -</p>
        </div>
      </div>

      <div
        class="relative overflow-hidden rounded-[24px] border border-mint/20 bg-panel p-6 shadow-[0_22px_80px_rgba(0,0,0,0.26)] lg:col-span-1"
      >
        <p class="text-sm font-semibold uppercase text-subtle">TVL</p>
        <p class="mt-6 text-4xl font-bold text-mint-text">
          {{ vaultData?.tvl || "_" }}
        </p>
      </div>

      <div
        class="relative overflow-hidden rounded-3xl border border-accent/20 bg-surface/90 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.28),0_0_34px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] backdrop-blur-xl lg:col-span-3"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <span
              class="flex h-12 w-12 items-center justify-center rounded-2xl border border-mint/20 bg-mint/10"
            >
              <img src="/imgs/ethereum.svg" class="h-7 w-7" alt="Ethereum" />
            </span>
            <div>
              <p class="text-sm font-semibold text-subtle">
                {{ wstethBalance?.symbol || "_" }} balance
              </p>
              <p class="mt-1 text-sm text-muted">Staked exposure</p>
            </div>
          </div>
          <button
            type="button"
            :class="[
              'rounded-full border border-white/10 bg-white/4 px-4 py-2 text-sm font-semibold text-soft transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              wstethBalance?.balance && wstethBalance.balance !== '-'
                ? 'hover:border-accent/35 hover:bg-accent/10 hover:text-accent cursor-pointer'
                : 'opacity-50 cursor-not-allowed',
            ]"
            :disabled="!wstethBalance?.balance"
          >
            Unstake
          </button>
        </div>
        <div class="mt-8">
          <p class="text-4xl font-bold text-white">
            {{ wstethBalance?.balance || "_" }}
          </p>
          <p class="mt-2 text-sm text-muted">$ -</p>
        </div>
      </div>
    </section>

    <section class="grid gap-5 md:grid-cols-2">
      <div
        class="relative overflow-hidden rounded-3xl border border-white/10 bg-panel p-6 shadow-[0_18px_70px_rgba(0,0,0,0.26)]"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-mint)_10%,transparent),transparent_42%)]"
        />
        <div class="relative">
          <p class="text-sm font-semibold uppercase text-subtle">
            Ascend points
          </p>
          <p class="mt-5 text-3xl font-bold text-white">-</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { PointsData, VaultData } from "@/types/vault";
import { useAccount } from "@wagmi/vue";
import { computed, watch } from "vue";

import useWalletBalance from "@/composables/useWalletBalance";
import useETHPrice from "@/composables/useETHPrice";

const { address } = useAccount();
const addressParam = computed(() => address.value || "");
const { ethBalance, wstethBalance } = useWalletBalance();

// const price = useETHPrice();
// console.log("wstethBalance", wstethBalance, price);

const { data: vaultData } = await useFetch<VaultData>("/api/vault");
const { data: pointsData, refresh: pointsRefresh } = await useFetch<PointsData>(
  "/api/vault/points",
  {
    params: {
      address: addressParam,
    },
    immediate: false,
  },
);

watch(
  address,
  (newAddress) => {
    if (newAddress) {
      pointsRefresh();
    }
  },
  { immediate: true },
);
</script>
