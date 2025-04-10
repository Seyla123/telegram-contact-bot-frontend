<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import {
  subscribeToUserChannel,
  unsubscribeFromChannel,
} from "@/services/pusherService.js";
import ContactList from "@/components/ContactList.vue";
import MessageList from "@/components/MessageList.vue";
import ChatHeader from "@/components/ChatHeader.vue";
import MessageInput from "@/components/MessageInput.vue";

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

onMounted(() => {
  subscribeToUserChannel(currentUser.value.id, (event) => {
    console.log("New message received:", event.message);
    messages.value.push(event.message);
  });
});

onBeforeUnmount(() => {
  unsubscribeFromChannel(currentUser.value.id);
});
</script>

<template>
  <div class="min-h-screen flex bg-[#1B2730] text-white">
    <ContactList
      :contacts="contacts"
      @select-contact="(contact) => console.log('Selected contact:', contact)"
    />

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col bg-[#1B2730] relative overflow-hidden">
      <!-- Stars Background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-50"
        ></div>
      </div>

      <ChatHeader
        :user="currentUser"
        @back="() => console.log('Back clicked')"
      />

      <MessageList :messages="messages" />

      <MessageInput @send="handleSendMessage" />
    </div>
  </div>
</template>
