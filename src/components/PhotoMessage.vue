<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  file_path: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    default: null,
  },
  created_at: {
    type: String,
    required: true,
  },
});

const isLoading = ref(true);
const showPreview = ref(false);

const aspectRatio = computed(() => {
  return (props.height / props.width) * 100;
});

const maxWidth = computed(() => {
  const maxWidthPixels = 300;
  return props.width > maxWidthPixels ? maxWidthPixels : props.width;
});

const formattedTime = computed(() => {
  return new Date(props.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
});

const handleImageLoad = () => {
  isLoading.value = false;
};

const togglePreview = () => {
  showPreview.value = !showPreview.value;
};
</script>

<template>
  <div class="photo-message-container">
    <div
      class="photo-wrapper"
      :style="{
        '--aspect-ratio': `${aspectRatio}%`,
        '--max-width': `${maxWidth}px`,
      }"
      @click="togglePreview"
    >
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="loading-skeleton">
        <div class="animate-pulse bg-gray-300 h-full w-full rounded-lg"></div>
      </div>

      <!-- Photo -->
      <img
        :src="file_path"
        :alt="message || 'Photo message'"
        class="photo"
        :class="{ 'opacity-0': isLoading }"
        @load="handleImageLoad"
      />
    </div>

    <!-- Caption -->
    <div v-if="message" class="caption">
      {{ message }}
    </div>

    <!-- Timestamp -->
    <div class="timestamp">
      {{ formattedTime }}
    </div>

    <!-- Full Screen Preview -->
    <div v-if="showPreview" class="preview-overlay" @click="togglePreview">
      <div class="preview-container" @click.stop>
        <img
          :src="file_path"
          :alt="message || 'Photo preview'"
          class="preview-image"
        />
        <button class="close-button" @click="togglePreview">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-message-container {
  max-width: var(--max-width);
  margin: 4px 0;
}

.photo-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: var(--aspect-ratio);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
}

.loading-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.caption {
  margin-top: 4px;
  font-size: 0.9rem;
  color: #ffffff;
}

.timestamp {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
}

.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.preview-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.preview-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
