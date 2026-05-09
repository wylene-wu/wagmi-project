<script setup lang="ts">
import { useSidebar } from "@/composables/useSidebar";
import {
  ToggleIcon,
  DashboardIcon,
  TransactionsIcon,
  StakeIcon,
} from "@/components/icons";

const LinkArrays = [
  {
    name: "Dashboard",
    path: "/",
    icon: DashboardIcon,
  },
  {
    name: "Stake",
    path: "/stake",
    icon: StakeIcon,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: TransactionsIcon,
  },
  // {
  //   name: "Settings",
  //   path: "/settings",
  //   icon: SettingsIcon,
  // },
];

const { isSidebarCollapsed, toggleSidebar } = useSidebar();
</script>

<template>
  <div
    :class="[
      'fixed left-0 z-10 h-full overflow-hidden border-r border-accent/15 bg-panel/82 px-4 pt-8 shadow-[18px_0_64px_rgba(0,0,0,0.20),0_0_32px_color-mix(in_srgb,var(--color-accent)_6%,transparent)] backdrop-blur-xl transition-all duration-300',
      isSidebarCollapsed ? 'w-20' : 'w-64',
    ]"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-surface)_68%,transparent),transparent_42%),radial-gradient(circle_at_top_left,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent_34%),radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-mint)_10%,transparent),transparent_28%)]"
    />
    <div
      :class="[
        'pb-6 relative flex items-center',
        isSidebarCollapsed ? 'justify-center' : 'justify-between',
      ]"
    >
      <h2
        :class="[
          'text-xl font-bold truncate text-white',
          isSidebarCollapsed ? 'hidden' : 'block',
        ]"
      >
        Menu
      </h2>
      <button
        type="button"
        aria-label="Toggle sidebar"
        class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-accent/15 bg-surface/75 text-accent transition duration-200 hover:border-accent/45 hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        @click="toggleSidebar"
      >
        <ToggleIcon
          :class="[
            'h-5 w-5 transition-transform duration-300',
            isSidebarCollapsed ? 'rotate-180' : 'rotate-0',
          ]"
        />
      </button>
    </div>
    <nav class="relative" aria-label="Primary navigation">
      <ul class="space-y-2">
        <li v-for="link in LinkArrays" :key="link.name">
          <NuxtLink
            :to="link.path"
            :class="[
              'group flex min-h-12 items-center rounded-2xl border font-medium text-muted transition duration-200 hover:border-accent/35 hover:bg-accent/10 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              isSidebarCollapsed
                ? 'justify-center px-1'
                : 'justify-start gap-3 px-4',
            ]"
            active-class="border-accent/55 bg-accent/10 !text-accent shadow-[0_0_28px_color-mix(in_srgb,var(--color-mint)_10%,transparent)]"
          >
            <component
              :is="link.icon"
              :class="[
                'shrink-0 transition duration-200',
                isSidebarCollapsed ? 'h-6 w-6' : 'h-4 w-4',
              ]"
            />
            <span
              :class="[
                'truncate text-sm',
                isSidebarCollapsed ? 'hidden' : 'block',
              ]"
              >{{ link.name }}</span
            >
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>
