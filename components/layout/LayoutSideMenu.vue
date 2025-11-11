<script setup lang="ts">
import { useSidebar } from "@/composables/useSidebar";
import {
  ToggleIcon,
  DashboardIcon,
  TransactionsIcon,
  SettingsIcon,
} from "@/components/icons";

const LinkArrays = [
  {
    name: "Dashboard",
    path: "/",
    icon: DashboardIcon,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: TransactionsIcon,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: SettingsIcon,
  },
];

const { isSidebarCollapsed, toggleSidebar } = useSidebar();
</script>

<template>
  <div
    :class="[
      'fixed h-full left-0 bg-[#0A0A0A]  px-4 pt-8 shadow-lg z-10 transition-all duration-300',
      isSidebarCollapsed ? 'w-20' : 'w-64',
    ]"
  >
    <div
      :class="[
        'pb-4 flex items-center',
        isSidebarCollapsed ? 'justify-center' : 'justify-between',
      ]"
    >
      <h2
        :class="[
          'text-xl font-bold truncate',
          isSidebarCollapsed ? 'hidden' : 'block',
        ]"
      >
        Menu
      </h2>
      <div class="p-1 rounded-full hover:bg-[#A1DBFE]">
        <ToggleIcon
          @click="toggleSidebar"
          :class="['w-5 h-5 ', isSidebarCollapsed ? 'rotate-180' : 'rotate-0']"
        />
      </div>
    </div>
    <nav>
      <ul class="space-y-2">
        <li v-for="link in LinkArrays" :key="link.name">
          <NuxtLink
            :to="link.path === 'Dashboard' ? '/' : link.path"
            :class="[
              'py-2  rounded  transition-colors flex items-center font-medium hover:bg-[#A1DBFE] hover:text-[#0a0a0a]',
              isSidebarCollapsed ? 'justify-center px-1' : 'justify-start px-4',
            ]"
            active-class="bg-[#A1DBFE] text-[#0a0a0a]"
          >
            <component
              :is="link.icon"
              :class="[isSidebarCollapsed ? 'w-6 h-6' : 'w-4 h-4']"
            />
            <span
              :class="[
                'ml-3 truncate',
                isSidebarCollapsed ? 'hidden' : 'block',
              ]"
              >{{ link.name }}</span
            >
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div
      :class="[
        'absolute bottom-4 left-4 right-4',
        isSidebarCollapsed ? 'hidden' : 'block',
      ]"
    >
      <p class="text-sm text-blue-300">Menu</p>
    </div>
  </div>
</template>
