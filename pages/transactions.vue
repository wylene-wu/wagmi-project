<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  layout: "default",
});

const activeTab = ref("transactions");
</script>

<template>
  <div class="">
    <h1 class="text-3xl font-bold mb-6">Transactions</h1>

    <div class="flex border-b border-gray-700 mb-6">
      <button
        v-for="tab in ['transactions', 'claims']"
        @click="activeTab = tab"
        :class="[
          'py-2 px-4 font-medium text-sm border-b-2',
          activeTab === tab
            ? 'border-blue-500 text-blue-500'
            : 'border-transparent text-gray-400 hover:text-white',
        ]"
      >
        {{ tab?.toLocaleUpperCase() }} LIST
      </button>
    </div>

    <div class="bg-gray-800 p-4 rounded-lg">
      <div v-if="activeTab === 'transactions'">
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

      <div v-else-if="activeTab === 'claims'">
        <h2 class="text-xl font-semibold mb-2">Recent Claims</h2>
        <ul class="space-y-2">
          <li class="border-b border-gray-700 pb-2">
            <div class="flex justify-between">
              <span>Claim #54321</span>
              <span class="text-green-400">+100 TOKEN</span>
            </div>
            <div class="text-sm text-gray-400">2023-05-15 14:30</div>
          </li>
          <li class="border-b border-gray-700 pb-2">
            <div class="flex justify-between">
              <span>Claim #54320</span>
              <span class="text-green-400">+50 TOKEN</span>
            </div>
            <div class="text-sm text-gray-400">2023-05-14 09:15</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
