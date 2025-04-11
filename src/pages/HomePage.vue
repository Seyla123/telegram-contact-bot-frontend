<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import {
  subscribeToUserChannel,
  unsubscribeFromChannel,
} from "@/services/pusherService.js";
import ContactList from "@/components/ContactList.vue";
import MessageList from "@/components/MessageList.vue";
import ChatHeader from "@/components/ChatHeader.vue";
import MessageInput from "@/components/MessageInput.vue";
import { useGetAllMessage } from "../services/messageApi";

// State management
const messages = ref([]);
const currentUser = ref({
  id: "1214783920",
  name: "Debra Nguyen",
  status: "online",
  avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=current",
});

// Mock contacts data
const contacts = ref(
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    lastMessage: "Last message preview...",
    timestamp: new Date(),
    avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${i}`,
  }))
);

// Message handling
const handleSendMessage = (message) => {
  const newMessage = {
    id: Date.now(),
    message,
    direction: "out",
    message_type: "text",
    created_at: new Date().toISOString(),
  };
  messages.value.push(newMessage);
};

// Mobile menu state
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleContactSelect = (contact) => {
  console.log("Selected contact:", contact);
  if (window.innerWidth < 768) {
    isMobileMenuOpen.value = false;
  }
};
const params = {
  page: 1,
  limit: 10,
};
const {
  data: messagesData,
  isLoading,
  isError,
  error,
  isFetched,
} = useGetAllMessage(params);

watch(
  () => messagesData?.value,
  (newData) => {
    if (newData?.data) {
      messages.value = [...newData.data] ;
    }
  },
  { immediate: true }
);
// Fetch once on mount
onMounted(() => {
  subscribeToUserChannel(currentUser.value.id, (event) => {
    console.log("New message received:", messages.value);
    messages.value.push(event.message);
  });
});
onBeforeUnmount(() => {
  unsubscribeFromChannel(currentUser.value.id);
});
</script>

<template>
  <div class="min-h-screen flex bg-[#1B2730] text-white relative">
    <!-- Mobile menu button -->
    <button
      class="md:hidden absolute top-4 left-4 z-50 p-2 bg-gray-700 rounded-full"
      @click="toggleMobileMenu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Contact list with mobile responsive behavior -->
    <div
      :class="[
        'md:relative md:translate-x-0 absolute inset-y-0 left-0 transform',
        'transition-transform duration-300 ease-in-out z-40',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <ContactList :contacts="contacts" @select-contact="handleContactSelect" />
    </div>

    <!-- Chat Area -->
    <div
      class="flex-1 flex flex-col bg-[#1B2730] relative overflow-hidden w-full"
    >
      <!-- Stars Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-50"
        ></div>
      </div>

      <ChatHeader
        :user="currentUser"
        @back="toggleMobileMenu"
        class="px-2 md:px-4"
      />

      <div class="flex-1 flex flex-col relative">
        <MessageList
          v-show="messages.length > 0"
          :messages="messages"
          class="flex-1 px-2 md:px-4 pb-[80px]"
        />
        <MessageInput
          @send="handleSendMessage"
          class="absolute bottom-0 left-0 right-0 px-2 md:px-4 pb-2 md:pb-4"
        />
      </div>
    </div>
  </div>
</template>
