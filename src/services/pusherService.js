import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_KEY || "fallback_key",
  cluster: import.meta.env.VITE_PUSHER_CLUSTER || "fallback_cluster",
  forceTLS: true,
});

export default echo;
