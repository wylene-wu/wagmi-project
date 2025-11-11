<template>
  <h1 class="text-3xl font-bold mb-6">Settings</h1>
  <p class="mb-4">This is the settings page.</p>

  <div class="bg-gray-800 p-4 rounded-lg">
    <h2 class="text-xl font-semibold mb-4">Wallet Settings</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Wallet Name</label>
        <input
          type="text"
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="My Wallet"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Network</label>
        <select
          class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Mainnet</option>
          <option>Testnet</option>
        </select>
      </div>
      <div class="flex items-center">
        <input
          type="checkbox"
          id="notifications"
          class="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
        />
        <label for="notifications" class="ml-2">Enable notifications</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
