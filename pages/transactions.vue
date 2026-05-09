<script setup lang="ts">
import { computed, ref } from "vue";

definePageMeta({
  layout: "default",
});

const activeTab = ref("transactions");

const tabs = [
  { id: "transactions", label: "Transactions" },
  { id: "claims", label: "Claims" },
];

const transactionRows = [
  {
    id: "Transaction #12345",
    time: "2023-05-15 14:30",
    amount: "+0.5 ETH",
    tone: "positive",
  },
  {
    id: "Transaction #12344",
    time: "2023-05-14 09:15",
    amount: "-0.2 ETH",
    tone: "negative",
  },
];

const claimRows = [
  {
    id: "Claim #54321",
    time: "2023-05-15 14:30",
    amount: "+100 TOKEN",
    tone: "positive",
  },
  {
    id: "Claim #54320",
    time: "2023-05-14 09:15",
    amount: "+50 TOKEN",
    tone: "positive",
  },
];

const visibleRows = computed(() =>
  activeTab.value === "transactions" ? transactionRows : claimRows,
);

const activeTabIndex = computed(() =>
  tabs.findIndex((tab) => tab.id === activeTab.value),
);
</script>

<template>
  <div class="relative space-y-6 overflow-hidden">
    <div
      class="pointer-events-none absolute inset-x-8 top-8 h-44 rounded-full bg-accent/10 blur-3xl"
    />

    <section class="relative">
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
        >
          Activity console
        </span>
        <span
          class="rounded-full border border-mint/20 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint-text"
        >
          Indexed history
        </span>
      </div>
      <h1 class="mt-4 text-3xl font-bold leading-tight text-text sm:text-4xl">
        Transactions
      </h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
        Review recent vault activity, staking movements, and claim records from
        the same Web3 console.
      </p>
    </section>

    <section
      class="relative overflow-hidden rounded-[28px] border border-accent/20 bg-panel p-5 shadow-[0_28px_120px_rgba(0,0,0,0.42),0_0_52px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] sm:p-6"
    >
      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_34%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-mint)_8%,transparent),transparent_36%)]"
      />

      <div class="relative">
        <div
          class="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-xs font-semibold uppercase text-subtle">History</p>
            <h2 class="mt-1 text-xl font-bold text-white">
              {{ activeTab === "transactions" ? "Recent transactions" : "Recent claims" }}
            </h2>
          </div>

          <div
            class="relative grid min-w-[260px] grid-cols-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] p-1"
            role="tablist"
            aria-label="Activity type"
          >
            <span
              :class="[
                'absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-accent/15 shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_12%,transparent)] transition-transform duration-300 ease-out',
                activeTabIndex === 1 ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0',
              ]"
              aria-hidden="true"
            />
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              role="tab"
              :aria-selected="activeTab === tab.id"
              @click="activeTab = tab.id"
              :class="[
                'relative z-10 min-h-10 rounded-full px-4 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                activeTab === tab.id
                  ? 'text-accent'
                  : 'text-muted hover:bg-white/[0.04] hover:text-white',
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="mt-5 space-y-3">
          <div
            v-for="row in visibleRows"
            :key="row.id"
            class="rounded-[22px] border border-white/10 bg-surface/70 p-4 transition duration-200 hover:border-accent/30 hover:bg-accent/10"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'h-2.5 w-2.5 rounded-full',
                    row.tone === 'positive' ? 'bg-mint-text' : 'bg-danger',
                  ]"
                />
                <div>
                  <p class="font-semibold text-white">{{ row.id }}</p>
                  <p class="mt-1 text-sm text-subtle">{{ row.time }}</p>
                </div>
              </div>
              <p
                :class="[
                  'font-bold',
                  row.tone === 'positive' ? 'text-mint-text' : 'text-danger',
                ]"
              >
                {{ row.amount }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
