<script setup>
import { computed } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      first_name: "",
      last_name: "",
      phone_number: "",
      avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=current",
    }),
  },
});

const emit = defineEmits(["back"]);

const fullName = computed(() => {
  const firstName = props.user.first_name || "";
  const lastName = props.user.last_name || "";
  return `${firstName} ${lastName}`.trim() || "Unknown User";
});

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return "No phone number";
  // Format: +855 95 501 717
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{3})(\d{3})$/);
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return phoneNumber;
};

console.log('user : ',props.user);

</script>

<template>
  <div
    class="border-b border-gray-700 p-4 flex items-center gap-3 bg-[#1B2730]"
  >
    <button @click="emit('back')" class="p-2 hover:bg-gray-700 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
    <img 
      :src="user?.avatar || 'https://api.dicebear.com/6.x/avataaars/svg?seed=current'" 
      class="w-10 h-10 rounded-full" 
      :alt="fullName"
    />
    <div class="flex-1">
      <h2 class="font-medium">{{ fullName }}</h2>
      <p class="text-sm text-gray-400">
        {{ formatPhoneNumber(user.phone_number) }}
      </p>
    </div>
    <div class="flex items-center gap-3">
      <button class="p-2 hover:bg-gray-700 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </button>
      <button class="p-2 hover:bg-gray-700 rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
