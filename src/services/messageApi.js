import { baseApi } from "@/services/baseApi";
import { useQuery } from "@tanstack/vue-query";

const getAllMessages = async (params) => {
  const { data } = await baseApi.get("/telegram/message", { params });
  const message = data?.data;

  console.log("message : ", message.data);

  return message;
};
export const useGetAllMessage = (params = {}) =>
  useQuery({
    queryKey: ["messages", params],
    queryFn: () => getAllMessages(params),
    staleTime: 60000,
  });
