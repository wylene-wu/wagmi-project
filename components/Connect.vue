<script setup lang="ts">
import { useChainId, useConnect } from "@wagmi/vue";

const chainId = useChainId();
const { connect, connectors, error, status } = useConnect();
console.log("status", status);
</script>

<template>
  <h2>Connect</h2>

  <div class="flex flex-col gap-2">
    <div
      v-for="connector in connectors.filter((i) => i.name !== 'Injected')"
      :key="connector.id"
      type="button"
      class="cursor-pointer mt-4 px-4 py-2 border border-gray-500 rounded-lg hover:bg-primary-dark"
      @click="connect({ connector, chainId })"
    >
      {{ connector.name }}
    </div>
  </div>

  <div v-if="!!error" class="text-red-500">
    {{ error?.message }}
  </div>
</template>
