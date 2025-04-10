<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const messagesContainer = ref(null);
const observer = ref(null);
const lastMessageRef = ref(null);

// Improved scroll behavior with smooth animation
const scrollToBottom = (smooth = true) => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }
};

// Watch for new messages and scroll to bottom
watch(
  () => props.messages.length,
  (newLength, oldLength) => {
    if (newLength > oldLength) {
      scrollToBottom();
    }
  }
);

onMounted(() => {
  // Initial scroll without smooth animation
  scrollToBottom(false);

  // Set up intersection observer for scroll behavior
  observer.value = new IntersectionObserver(
    (entries) => {
      const lastEntry = entries[0];
      if (lastEntry.isIntersecting) {
        scrollToBottom();
      }
    },
    { threshold: 0.5 }
  );

  if (lastMessageRef.value) {
    observer.value.observe(lastMessageRef.value);
  }
});

// Format timestamp
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div
    ref="messagesContainer"
    class="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth"
  >
    <div
      v-for="(message, index) in messages"
      :key="message.id"
      :ref="index === messages.length - 1 ? lastMessageRef : undefined"
      class="flex flex-col"
    >
      <div
        class="px-4 py-2 max-w-[85%] space-y-1"
        :class="message.direction === 'in' ? '' : 'ml-auto'"
      >
        <!-- Message Content -->
        <div
          :class="[
            'rounded-2xl px-4 py-2',
            message.direction === 'in'
              ? 'bg-gray-700 text-white rounded-tl-none'
              : 'bg-blue-500 text-white rounded-tr-none',
          ]"
        >
          <!-- Text Message -->
          <p v-if="message.message_type === 'text'" class="text-sm">
            {{ message.message }}
          </p>

          <!-- Media Message -->
          <div v-else-if="message.file_path" class="space-y-2">
            <div
              v-if="
                message.message_type === 'photo' ||
                message.mime_type?.startsWith('image')
              "
              class="rounded-lg overflow-hidden"
            >
              <img
                :src="message.file_path"
                :alt="message.file_name || 'Photo'"
                class="w-full h-auto max-h-[300px] object-cover"
                loading="lazy"
              />
              <p v-if="message.message" class="mt-2 text-sm">
                {{ message.message }}
              </p>
            </div>
            <video
              v-else-if="message.mime_type?.startsWith('video')"
              controls
              class="rounded-lg w-full max-h-[300px]"
            >
              <source :src="message.file_path" :type="message.mime_type" />
            </video>
            <a
              v-else
              :href="message.file_path"
              target="_blank"
              class="text-blue-200 hover:text-blue-300 text-sm underline"
            >
              {{ message.file_name || "Download File" }}
            </a>
          </div>
        </div>
        <!-- Timestamp -->
        <span
          class="text-xs text-gray-400 block"
          :class="message.direction === 'in' ? 'text-left' : 'text-right'"
        >
          {{ formatTime(message.created_at) }}
        </span>
      </div>
    </div>
  </div>
</template>
