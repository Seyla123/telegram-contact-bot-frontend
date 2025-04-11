<script setup>
import { ref, watch } from "vue";
import ChatHeader from "./ChatHeader.vue";
import MessageList from "./MessageList.vue";
import MessageInput from "./MessageInput.vue";
import WelcomeScreen from "./WelcomeScreen.vue";

const props = defineProps({
  selectedContact: {
    type: Object,
    default: null,
  },
  messages: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["send-message", "toggle-mobile-menu"]);

const handleSendMessage = (message) => {
  emit("send-message", message);
};
</script>

<template>
  <div class="flex flex-col bg-[#1B2730] w-full">
    <!-- Stars Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-50"
      ></div>
    </div>

    <div class="flex flex-col h-full relative">
      <template v-if="selectedContact">
        <ChatHeader
          :user="selectedContact"
          @back="$emit('toggle-mobile-menu')"
          class="px-2 md:px-4 bg-[#1B2730] border-b border-gray-700 sticky top-0 z-10"
        />
        <MessageList
          v-show="messages.length > 0"
          :messages="messages"
          class="flex-1 overflow-y-auto min-h-0"
        />
        <MessageInput
          @send="handleSendMessage"
          class="fixed md:sticky bottom-0 left-0 right-0 px-2 md:px-4 md:pb-4 bg-[#1B2730]"
        />
      </template>
      <WelcomeScreen v-else class="flex-1" />
    </div>
  </div>
</template>
