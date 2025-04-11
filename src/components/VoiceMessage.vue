<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  file_path: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

const audio = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const progress = ref(0);
const waveformCanvas = ref(null);
const waveformContext = ref(null);
const waveformData = ref([]);
const isDragging = ref(false);

const generateWaveform = () => {
  const ctx = waveformContext.value;
  const canvas = waveformCanvas.value;
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = isPlaying.value ? "#3390EC" : "#72767D";

  const barWidth = 2;
  const barGap = 1;
  const totalBars = Math.floor(canvas.width / (barWidth + barGap));
  const barHeightMultiplier = canvas.height / 2;

  for (let i = 0; i < totalBars; i++) {
    const amplitude = Math.random() * 0.5 + 0.2;
    const height = amplitude * barHeightMultiplier;
    const x = i * (barWidth + barGap);
    const y = (canvas.height - height) / 2;

    ctx.fillRect(x, y, barWidth, height);
  }
};

const togglePlay = () => {
  if (audio.value) {
    if (isPlaying.value) {
      audio.value.pause();
    } else {
      audio.value.play();
    }
    isPlaying.value = !isPlaying.value;
    generateWaveform();
  }
};

const onTimeUpdate = () => {
  if (audio.value && !isDragging.value) {
    currentTime.value = Math.floor(audio.value.currentTime);
    progress.value = (audio.value.currentTime / props.duration) * 100;
  }
};

const onEnded = () => {
  isPlaying.value = false;
  currentTime.value = 0;
  progress.value = 0;
  generateWaveform();
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const handleProgressClick = (event) => {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = (x / rect.width) * 100;
  const newTime = (props.duration * percentage) / 100;

  if (audio.value) {
    audio.value.currentTime = newTime;
    progress.value = percentage;
    currentTime.value = Math.floor(newTime);
  }
};

const startDragging = () => {
  isDragging.value = true;
};

const stopDragging = () => {
  isDragging.value = false;
};

onMounted(() => {
  if (waveformCanvas.value) {
    waveformContext.value = waveformCanvas.value.getContext("2d");
    generateWaveform();
  }
});

onBeforeUnmount(() => {
  if (audio.value) {
    audio.value.pause();
    audio.value.currentTime = 0;
  }
});
</script>

<template>
  <div
    class="flex items-center space-x-3 bg-[#212121] rounded-2xl p-2.5 max-w-[300px] group hover:bg-[#2C2C2C] transition-colors duration-200"
  >
    <audio
      ref="audio"
      :src="file_path"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
    />

    <!-- Play/Pause Button -->
    <button
      @click="togglePlay"
      class="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-[#3390EC] rounded-full hover:bg-[#4BA3F8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3390EC] focus:ring-opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          v-if="!isPlaying"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
        />
        <path
          v-else
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 9v6m4-6v6"
        />
      </svg>
    </button>

    <div class="flex-1 flex flex-col min-w-0">
      <!-- Waveform Visualization -->
      <div
        class="relative w-full h-[38px] cursor-pointer"
        @click="handleProgressClick"
      >
        <canvas
          ref="waveformCanvas"
          class="w-full h-full"
          width="200"
          height="38"
        />
        <div
          class="absolute top-0 left-0 h-full bg-[#3390EC] opacity-20 pointer-events-none transition-all duration-100"
          :style="{ width: `${progress}%` }"
        />
      </div>

      <!-- Time Display -->
      <div
        class="flex items-center justify-between text-xs text-[#8E8E92] mt-1"
      >
        <span class="font-medium">{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(props.duration) }}</span>
      </div>
    </div>
  </div>
</template>
