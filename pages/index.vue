<template>
  <ClientOnly>
    <div class="flex flex-col items-center justify-center">
      <Connect />
      <Account v-if="isConnected" class="mt-6" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useAccount } from "@wagmi/vue";
import { computed } from "vue";

const { status } = useAccount();
const isConnected = computed(() => status.value === "connected");
</script>
