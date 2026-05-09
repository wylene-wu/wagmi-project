<script setup lang="ts"></script>

<template>
  <header
    class="fixed left-0 right-0 top-0 z-20 border-b border-accent/15 bg-panel/80 shadow-[0_16px_54px_rgba(0,0,0,0.18),0_0_28px_color-mix(in_srgb,var(--color-accent)_6%,transparent)] backdrop-blur-xl"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent_34%,color-mix(in_srgb,var(--color-mint)_6%,transparent))]"
    />
    <div class="relative flex min-h-16 items-center justify-between px-4 py-3">
      <div class="flex min-w-0 items-center gap-3">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-surface/80 shadow-[0_0_28px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]"
        >
          <span class="text-sm font-bold text-accent">A</span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-mint-text" />
            <h1
              class="truncate text-xl font-bold leading-6 text-white sm:text-2xl"
            >
              Ascend
            </h1>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <WalletAccount />
      </div>
    </div>
  </header>
</template>
