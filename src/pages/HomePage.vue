<script setup>
// Import the Echo instance
import echo from "@/services/pusherService.js";
import { ref, onMounted, onBeforeUnmount } from 'vue';
// import { useStore } from 'vuex';

// const store = useStore();
const messages = ref([]);

onMounted(() => {
  // Listen to the channel and event
  echo
    .private("user." + '1214783920') // Example: listening to a private channel
    .listen("new_message", (event) => {
      console.log("New message received:", event);
      messages.value.push(event.message); // Assuming the event contains a message property
    });
});

onBeforeUnmount(() => {
  echo.leave("user." + store.state.user.id); // Leave the channel when the component is destroyed
});
</script>

<template>
  <div>
    <h2>Real-time Messages</h2>
    <div v-for="message in messages" :key="message.id">
      <p>{{ message.message }}</p>
    </div>
  </div>
</template>
