<script setup lang="ts">
import { useSidebar } from "@/composables/useSidebar";
import { useAccount } from "@wagmi/vue";
import { computed } from "vue";

const { status } = useAccount();
const isConnected = computed(() => status.value === "connected");
const { isSidebarCollapsed } = useSidebar();
</script>

<template>
  <div class="min-h-screen h-screen bg-gray-900 text-white flex flex-col">
    <LayoutHeader />
    <div class="flex h-full pt-16">
      <LayoutSideMenu />
      <main
        :class="[
          'flex-1 flex flex-col transition-all duration-300',
          isSidebarCollapsed ? 'ml-20' : 'ml-64',
        ]"
      >
        <div class="flex-1 p-8 overflow-y-auto">
          <Connect v-if="!isConnected" />
          <slot v-else />
        </div>
        <footer class="p-4 border-t border-gray-700 text-center text-gray-400">
          <p>© Wagmi Wallet App</p>
        </footer>
      </main>
    </div>
  </div>
</template>
