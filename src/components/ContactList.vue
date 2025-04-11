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

const getFullName = (contact) => {
  const firstName = contact.first_name || "";
  const lastName = contact.last_name || "";
  return `${firstName} ${lastName}`.trim() || "Unknown";
};

const formatPhoneNumber = (phoneNumber) => {
  return phoneNumber || "No phone number";
};

const getAvatarUrl = (contact) => {
  return `https://api.dicebear.com/6.x/avataaars/svg?seed=${contact.id}`;
};
</script>

<template>
  <div
    class="w-[300px] md:w-[350px] border-r border-gray-700 bg-[#1B2730] p-4 flex flex-col h-screen md:h-auto"
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

    <div
      class="flex gap-2 md:gap-3 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
    >
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
        v-for="contact in contacts"
        :key="contact.id"
        @click="emit('select-contact', contact)"
        class="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-200"
      >
        <img
          :src="getAvatarUrl(contact)"
          :alt="getFullName(contact)"
          class="w-12 h-12 rounded-full object-cover"
        />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <h3 class="font-medium truncate">{{ getFullName(contact) }}</h3>
            <span class="text-xs text-gray-400">{{
              formatTime(contact.created_at)
            }}</span>
          </div>
          <p class="text-sm text-gray-400 truncate">
            {{ formatPhoneNumber(contact.phone_number) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
