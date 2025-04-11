<script setup>
// No props or state needed for this component
</script>

<template>
  <div class="flex-1 flex flex-col items-center justify-center p-8 text-center">
    <div class="w-32 h-32 mb-8">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        class="w-full h-full text-blue-400 animate-pulse"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </div>
    <h2 class="text-2xl font-bold mb-4 text-blue-400">Start a Conversation</h2>
    <p class="text-gray-400 max-w-md mb-8">
      Select a contact from the list to begin messaging. Your conversations will
      appear here.
    </p>
    <div class="flex items-center gap-2 text-sm text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
          clip-rule="evenodd"
        />
      </svg>
      <span>Click on a contact to start chatting</span>
    </div>
  </div>
</template>
