import { baseApi } from "@/services/baseApi";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { computed, unref } from "vue";

const getAllMessages = async (params) => {
  const { data } = await baseApi.get("/telegram/message", { params });
  const message = data?.data;
  return message;
};

const sendMessage = async (messageData) => {
  const { data } = await baseApi.post("/telegram/message", messageData);
  return data;
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      console.log("Message sent successfully:", data);
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });
};
export const useGetAllMessage = (paramsRef) => {
  const resolvedParams = computed(() => unref(paramsRef));

  return useQuery({
    queryKey: computed(() => ["messages", resolvedParams.value?.chat_id]),
    queryFn: () => {
      if (!resolvedParams.value?.chat_id) return Promise.resolve(null);
      return getAllMessages(resolvedParams.value);
    },
    enabled: computed(() => !!resolvedParams.value?.chat_id), // ✅ reactive enabled
    staleTime: 60000,
  });
};
