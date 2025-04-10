<script setup>
import { ref } from "vue";

const props = defineProps({
  contacts: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["select-contact"]);
const selectedFilter = ref("Friends");

const filters = [
  { id: 1, name: "Friends", active: true },
  { id: 2, name: "Teachers", active: false },
  { id: 3, name: "Groups", active: false },
  { id: 4, name: "Add More", active: false },
];

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div
    class="w-[350px] border-r border-gray-700 bg-[#1B2730] p-4 flex flex-col"
  >
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold">Message's (32)</h1>
      <button class="p-2 hover:bg-gray-700 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>

    <div class="flex gap-3 mb-6 overflow-x-auto pb-2">
      <button
        v-for="filter in filters"
        :key="filter.id"
        @click="selectedFilter = filter.name"
        class="px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors"
        :class="[
          selectedFilter === filter.name ? 'bg-blue-500' : 'bg-gray-700',
        ]"
      >
        {{ filter.name }}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto space-y-4">
      <div
        v-for="i in 8"
        :key="i"
        @click="emit('select-contact', i)"
        class="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition-colors"
      >
        <img
          :src="`https://api.dicebear.com/6.x/avataaars/svg?seed=${i}`"
          class="w-12 h-12 rounded-full"
          :alt="`Contact ${i}`"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h3 class="font-medium truncate">User Name</h3>
            <span class="text-xs text-gray-400">12:34 PM</span>
          </div>
          <p class="text-sm text-gray-400 truncate">Last message preview...</p>
        </div>
      </div>
    </div>
  </div>
</template>
