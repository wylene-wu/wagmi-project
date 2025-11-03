<script setup lang="ts">
import { useAccount, useDisconnect } from "@wagmi/vue";
import { watch } from "vue";

const { address, chainId, status } = useAccount();
const { disconnect } = useDisconnect();

const isConnected = computed(() => status.value === "connected");
</script>

<template>
  <div class="p-6 bg-primary-50 text-primary-800">
    <h1 class="text-4xl font-display">Hello Nuxt + Tailwind</h1>
    <button
      class="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
    >
      Click me !
    </button>
  </div>
  <h2 class="font-bold text-lg">Account</h2>
  <p>status: {{ status }}</p>

  <div v-if="isConnected">
    account: {{ address }}
    <br />
    chainId: {{ chainId }}
    <br />
  </div>

  <button
    class="cursor-pointer py-2 px-3 border border-gray-600 rounded-full"
    v-if="status !== 'disconnected'"
    type="button"
    @click="disconnect()"
  >
    Disconnect
  </button>
</template>
