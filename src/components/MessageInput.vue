<script setup>
import { ref } from "vue";
import "emoji-picker-element";

const emit = defineEmits(["send"]);
const newMessage = ref("");
const isEmojiPickerVisible = ref(false);
const isRecording = ref(false);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
const selectedFile = ref(null);
const fileInputRef = ref(null);

const sendMessage = () => {
  const message = newMessage.value.trim();
  if (!message && !selectedFile.value) return;

  if (selectedFile.value) {
    emit("send", {
      type: "file",
      file: selectedFile.value,
      name: selectedFile.value.name,
    });
    selectedFile.value = null;
  } else {
    emit("send", { type: "text", content: message });
  }
  newMessage.value = "";
};

const toggleEmojiPicker = () => {
  isEmojiPickerVisible.value = !isEmojiPickerVisible.value;
};

const onEmojiSelect = (event) => {
  newMessage.value += event.detail.emoji.unicode;
  isEmojiPickerVisible.value = false;
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];


    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    };

    mediaRecorder.value.onstop = () => {
      const audioBlob = new Blob(audioChunks.value, { type: "audio/wav" });
      emit("send", {
        type: "audio",
        file: audioBlob,
        name: `Voice Message ${new Date().toLocaleTimeString()}`,
      });
    };

    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (error) {
    console.error("Error accessing microphone:", error);
  }
};

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
    mediaRecorder.value.stream.getTracks().forEach((track) => track.stop());
  }
};
</script>

<template>
  <div
    class="w-full p-4 bg-[#1B2730] border-t border-gray-700 backdrop-blur-sm bg-opacity-95"
  >
    <div class="relative flex items-center gap-3 max-w-screen-xl mx-auto">
      <input
        ref="fileInputRef"
        type="file"
        @change="handleFileSelect"
        class="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />
      <button
        @click="() => fileInputRef.value.click()"
        class="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
        title="Attach file"
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
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </button>
      <button
        @click="toggleEmojiPicker"
        class="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
        title="Add emoji"
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
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type a message"
        @keyup.enter="sendMessage"
        class="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="isRecording ? stopRecording() : startRecording()"
        class="p-2 hover:bg-gray-700 rounded-full transition-colors"
        :class="isRecording ? 'text-red-500' : 'text-gray-400 hover:text-white'"
        title="Record voice message"
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
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </button>
      <button
        @click="sendMessage"
        class="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors"
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
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
      <!-- Emoji Picker -->
      <div v-if="isEmojiPickerVisible" class="absolute bottom-full left-0 mb-2">
        <emoji-picker @emoji-click="onEmojiSelect" class="light"></emoji-picker>
      </div>

      <!-- Selected File Preview -->
      <div
        v-if="selectedFile"
        class="absolute bottom-full left-0 mb-2 bg-gray-800 p-2 rounded-lg flex items-center gap-2"
      >
        <span class="text-sm text-gray-300">{{ selectedFile.name }}</span>
        <button
          @click="selectedFile = null"
          class="text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
emoji-picker {
  --background: #1f2937;
  --border-color: #374151;
  --category-emoji-padding: 0.5rem;
  height: 300px;
}
</style>
