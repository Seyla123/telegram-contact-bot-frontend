// pusherService.js

import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_KEY || "fallback_key",
  cluster: import.meta.env.VITE_PUSHER_CLUSTER || "fallback_cluster",
  forceTLS: true,
  authEndpoint: "/api/broadcasting/auth",
});

export function subscribeToUserChannel(userId, callback) {
  console.log("subscribing to user channel");
  return echo.channel(`user.${userId}`).listen(".new_message", callback);
}

export function unsubscribeFromChannel(channel) {
  console.log("unsubscribing from user channel");
  channel.stopListening(".new_message");
}

export default echo;
