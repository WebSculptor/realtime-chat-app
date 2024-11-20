import { create } from "zustand";

import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:2000" : "/";

export const useAuthStore = create((setFn, getFn) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingAvatar: false,

  onlineUsers: [],
  isCheckingAuth: true,

  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      setFn({ authUser: res.data.result });

      getFn().connectSocket();
    } catch (error) {
      setFn({ authUser: null });
      console.log(error);
    } finally {
      setFn({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    setFn({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/sign-up", data);
      setFn({ authUser: res.data.result });
      toast.success(res.data.message);

      getFn().connectSocket();
    } catch (error) {
      setFn({ authUser: null });
      toast.error(error.response.data.message);
    } finally {
      setFn({ isSigningUp: false });
    }
  },

  signIn: async (data) => {
    setFn({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/sign-in", data);
      setFn({ authUser: res.data.result });
      toast.success(res.data.message);

      getFn().connectSocket();
    } catch (error) {
      setFn({ authUser: null });
      toast.error(error.response.data.message);
    } finally {
      setFn({ isLoggingIn: false });
    }
  },

  signOut: async () => {
    try {
      const res = await axiosInstance.post("/auth/sign-out");
      setFn({ authUser: null });
      toast.success(res.data.message);

      getFn().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateAvatar: async (data) => {
    setFn({ isUpdatingAvatar: true });

    console.log(data);

    try {
      const res = await axiosInstance.put("/auth/avatar", data);
      setFn({ authUser: res.data.result });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(`[UPLOAD ERROR]: ${error}`);
    } finally {
      setFn({ isUpdatingAvatar: false });
    }
  },

  connectSocket: () => {
    const { authUser } = getFn();
    if (!authUser || getFn().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    setFn({ socket });

    socket.on("online_users", (usersId) => {
      setFn({ onlineUsers: usersId });
    });
  },

  disconnectSocket: () => {
    if (getFn().socket?.connected) getFn().socket?.disconnect();
  },
}));
