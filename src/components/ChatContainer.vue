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
  <div
    class="flex-1 flex flex-col bg-[#1B2730] relative w-full h-screen overflow-hidden"
  >
    <!-- Stars Background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-50"
      ></div>
    </div>

    <div class="flex-1 flex flex-col relative h-full">
      <template v-if="selectedContact">
        <ChatHeader
          :user="selectedContact"
          @back="$emit('toggle-mobile-menu')"
          class="px-2 md:px-4 sticky top-0 z-10 bg-[#1B2730]"
        />
        <MessageList
          v-show="messages.length > 0"
          :messages="messages"
          class="flex-1 px-2 md:px-4 overflow-y-auto"
        />
        <MessageInput
          @send="handleSendMessage"
          class="sticky bottom-0 left-0 right-0 px-2 md:px-4 pb-2 md:pb-4 bg-[#1B2730]"
        />
      </template>
      <WelcomeScreen v-else />
    </div>
  </div>
</template>
