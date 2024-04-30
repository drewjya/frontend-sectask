import { io, type Socket } from "socket.io-client";

export const useSocketClient = defineStore("SocketClient", () => {
  const app = useAppStore();
  const socket = ref<Socket>();

  async function getConnection() {
    await new Promise((resolve) => {
      if (socket.value === undefined) {
        const url =
          useRuntimeConfig().public.SOCKET_URL ??
          "http://localhost:3000/events";
        console.log(url);

        socket.value = io(`${url}`, {
          autoConnect: true,

          auth: {
            token: `Bearer ${app.accessToken}`,
          },
        });
        resolve(true);
      } else {
        resolve(false);
      }
    });
    return socket.value!;
  }

  return {
    getConnection,
  };
});
