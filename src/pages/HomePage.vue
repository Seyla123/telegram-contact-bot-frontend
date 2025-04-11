<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import {
  subscribeToUserChannel,
  unsubscribeFromChannel,
} from "@/services/pusherService.js";
import ContactList from "@/components/ContactList.vue";
import ChatContainer from "@/components/ChatContainer.vue";
import { useGetAllMessage } from "../services/messageApi";
import { useGetAllContacts } from "../services/contactApi";

// State management
const messages = ref([]);
const currentUser = ref({
  id: "1214783920",
  first_name: "seav",
  last_name: "seyla",
  username: null,
  phone_number: "85595501717",
  created_at: "2025-04-09T06:16:27.000000Z",
  updated_at: "2025-04-09T06:17:18.000000Z",
  avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=current",
});

// Mock contacts data
const contacts = ref([]);

// Chat state
const selectedContact = ref(null);
// Message handling
const handleSendMessage = (message) => {
  const newMessage = {
    id: Date.now(),
    message,
    direction: "out",
    message_type: "text",
    created_at: new Date().toISOString(),
  };
  messages.value.push(newMessage);
};

// Mobile menu state
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const handleContactSelect = (contact) => {
  console.log("Selected contact:", contact);
  selectedContact.value = contact;
  if (window.innerWidth < 768) {
    isMobileMenuOpen.value = false;
  }
};
const messageQueryParams = computed(() => {
  if (!selectedContact.value) return undefined;
  return {
    page: 1,
    limit: 1,
    chat_id: selectedContact.value?.id,
  };
});

const {
  data: messagesData,
  isLoading,
  isError,
  error,
  isFetched,
} = useGetAllMessage(messageQueryParams);
const { data: contactsData } = useGetAllContacts();

watch(
  () => contactsData?.value,
  (newData) => {
    if (newData?.data) {
      contacts.value = [...newData.data];
    }
  },
  { immediate: true }
);

watch(
  () => messagesData?.value,
  (newData) => {
    if (newData?.data) {
      const newMessages = newData.data;

      console.log("New messages:", newMessages);

      messages.value = [...newMessages];
    }
  },
  { immediate: true }
);
// Fetch once on mount
onMounted(() => {
  subscribeToUserChannel(currentUser.value.id, (event) => {
    messages.value.push(event.message);
    console.log("New message received:", messages.value);
  });
});
onBeforeUnmount(() => {
  unsubscribeFromChannel(currentUser.value.id);
});
</script>

<template>
  <div class="min-h-screen flex bg-[#1B2730] text-white relative">
    <!-- Mobile menu button -->
    <button
      class="md:hidden absolute top-4 left-4 z-50 p-2 bg-gray-700 rounded-full"
      @click="toggleMobileMenu"
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
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <!-- Contact list with mobile responsive behavior -->
    <div
      :class="[
        'md:relative md:translate-x-0 absolute inset-y-0 left-0 transform',
        'transition-transform duration-300 ease-in-out z-40',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <ContactList
        :contacts="contactsData"
        @select-contact="handleContactSelect"
      />
    </div>

    <ChatContainer
      :selected-contact="selectedContact"
      :messages="messages"
      @send-message="handleSendMessage"
      @toggle-mobile-menu="toggleMobileMenu"
    />
  </div>
</template>
