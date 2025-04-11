<script setup>
import { ref, onMounted, watch } from "vue";
import VoiceMessage from "./VoiceMessage.vue";

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => [],
  },
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
    class="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth flex flex-col-reverse"
  >
    <div
      v-for="message in [...messages].reverse()"
      :key="message?.id"
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
            <!-- Voice Message -->
            <div
              v-if="message.message_type === 'voice'"
              class="rounded-lg overflow-hidden"
            >
              <VoiceMessage
                :file_path="message.file_path"
                :duration="message.duration"
              />
            </div>
            <!-- Photo Message -->
            <div
              v-else-if="
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
