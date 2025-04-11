import { baseApi } from "@/services/baseApi";
import { useQuery } from "@tanstack/vue-query";

const getAllContacts = async (params) => {
  const { data } = await baseApi.get("/telegram/contact", { params });
  console.log("contacts : ", data?.data);
  return data?.data?.data;
};
export const useGetAllContacts = (params = {}) =>
  useQuery({
    queryKey: ["contacts", params],
    queryFn: () => getAllContacts(params),
    staleTime: 60000,
  });
