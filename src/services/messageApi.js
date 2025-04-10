import { baseApi } from "@/services/baseApi";

// Fetch notes
const getAllMessages = async (params) => {
  const { data } = await baseApi.get("/telegram/message", { params });
  return data;
};
