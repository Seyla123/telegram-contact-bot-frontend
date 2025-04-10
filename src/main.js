import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import router from "@/routes/routes";
const app = createApp(App);

app.use(router);
const queryClient = new QueryClient();
app.use(VueQueryPlugin, { queryClient });

app.mount("#app");
