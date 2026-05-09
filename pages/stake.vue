<template>
  <div class="relative mx-auto max-w-3xl space-y-6 overflow-hidden">
    <section class="relative">
      <h1 class="mt-4 text-3xl font-bold leading-tight text-text sm:text-4xl">
        Stake
      </h1>
    </section>

    <section
      class="relative overflow-hidden rounded-[28px] border border-accent/20 bg-panel p-5 shadow-[0_28px_120px_rgba(0,0,0,0.44),0_0_52px_color-mix(in_srgb,var(--color-mint)_12%,transparent)] sm:p-6"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_16%,transparent),transparent_34%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-mint)_10%,transparent),transparent_36%)]"
      />

      <div class="relative space-y-5">
        <div>
          <p class="text-xs font-semibold uppercase text-subtle">Action</p>
          <h2 class="mt-1 text-xl font-bold text-white">Stake input</h2>
        </div>

        <div class="rounded-xl border border-white/10 bg-surface/90 p-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label class="sr-only" for="stake-amount">Stake amount</label>
            <input
              id="stake-amount"
              type="text"
              inputmode="decimal"
              class="min-h-14 flex-1 bg-transparent text-3xl font-bold text-white outline-none placeholder:text-subtle focus:ring-0"
              placeholder="0"
            />
            <div
              class="flex min-h-12 items-center gap-3 rounded-2xl border border-accent/20 bg-accent/10 px-4"
            >
              <img src="/imgs/ethereum.svg" class="h-6 w-6" alt="Ethereum" />
              <span class="font-semibold text-accent">ETH</span>
            </div>
          </div>
          <div
            class="mt-4 flex items-center justify-between gap-4 text-sm text-muted"
          >
            <p>$</p>
            <div class="flex items-center gap-3">
              <span>Balance: --</span>
              <button
                type="button"
                class="min-h-9 rounded-full border border-accent/25 bg-accent/10 px-4 text-sm font-semibold text-accent transition duration-200 hover:border-accent/55 hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Max
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl border border-mint/20 bg-mint/10 text-mint-text"
          >
            <TransferIcon class="h-7 w-7 rotate-90" />
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <label class="sr-only" for="receive-amount">Receive amount</label>
            <input
              id="receive-amount"
              type="text"
              inputmode="decimal"
              class="min-h-14 flex-1 bg-transparent text-3xl font-bold text-white outline-none placeholder:text-subtle focus:ring-0"
              placeholder="0"
            />
            <div
              class="flex min-h-12 items-center rounded-2xl border border-mint/20 bg-mint/10 px-4 font-semibold text-mint-text"
            >
              Token
            </div>
          </div>
          <div
            class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted"
          >
            <p>$</p>
            <p>Balance: --</p>
          </div>
        </div>

        <button
          type="button"
          class="min-h-14 w-full rounded-2xl border border-accent/30 bg-accent/15 text-lg font-semibold text-accent shadow-[0_0_32px_color-mix(in_srgb,var(--color-accent)_14%,transparent)] transition duration-200 hover:border-accent/60 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
        >
          Stake
        </button>
      </div>
    </section>

    <section
      class="grid gap-3 rounded-xl border border-white/10 bg-panel p-5 text-sm shadow-[0_18px_70px_rgba(0,0,0,0.26)]"
    >
      <div class="flex items-center justify-between gap-4">
        <p class="text-subtle">Exchange Rate</p>
        <p class="font-semibold text-soft">1 ETH = 1000 Tokens</p>
      </div>
      <div class="flex items-center justify-between gap-4">
        <p class="text-subtle">Fee</p>
        <p class="font-semibold text-soft">1%</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { TransferIcon } from "@/components/icons";
definePageMeta({
  layout: "default",
});
</script>
