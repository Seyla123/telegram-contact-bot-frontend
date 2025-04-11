import { baseApi } from "@/services/baseApi";
import { useQuery } from "@tanstack/vue-query";
import { computed, unref } from "vue";

const getAllMessages = async (params) => {
  const { data } = await baseApi.get("/telegram/message", { params });
  const message = data?.data;

  console.log("message : ", message.data);

  return message;
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
