<script setup>
// Import the Echo instance
import echo, { subscribeToUserChannel } from "@/services/pusherService.js";
import { ref, onMounted, onBeforeUnmount } from "vue";
// Create a reactive array for messages
const messages = ref([]);

// Assume userId is dynamically set or passed to the component
const userId = "1214783920";

onMounted(() => {
  // Listen to the private channel for the current user
  subscribeToUserChannel(userId, (event) => {
    console.log("New message received:", event.message);
    messages.value.push(event.message);
  });
});

onBeforeUnmount(() => {
  // Leave the private channel when the component is destroyed
  unsubscribeFromChannel(userId);
});
</script>

<template>
  <div>
    <h2>Real-time Messages</h2>
    <!-- Loop through messages and display them -->
    <div v-for="message in messages" :key="message.id">
      <p>{{ message.message }}</p>
    </div>
  </div>
</template>
