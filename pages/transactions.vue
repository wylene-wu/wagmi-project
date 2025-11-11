<template>
  <h1 class="text-3xl font-bold mb-6">Transactions</h1>
  <p class="mb-4">This is the transactions page.</p>

  <div class="bg-gray-800 p-4 rounded-lg">
    <h2 class="text-xl font-semibold mb-2">Recent Transactions</h2>
    <ul class="space-y-2">
      <li class="border-b border-gray-700 pb-2">
        <div class="flex justify-between">
          <span>Transaction #12345</span>
          <span class="text-green-400">+0.5 ETH</span>
        </div>
        <div class="text-sm text-gray-400">2023-05-15 14:30</div>
      </li>
      <li class="border-b border-gray-700 pb-2">
        <div class="flex justify-between">
          <span>Transaction #12344</span>
          <span class="text-red-400">-0.2 ETH</span>
        </div>
        <div class="text-sm text-gray-400">2023-05-14 09:15</div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>
