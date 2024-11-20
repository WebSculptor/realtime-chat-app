import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create(
  persist(
    (setFn, getFn) => ({
      messages: [],
      users: [],
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: false,

      getUsers: async () => {
        setFn({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/chat/users");
          setFn({ users: res.data.result });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          setFn({ isUsersLoading: false });
        }
      },

      getMessages: async (userId) => {
        setFn({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/chat/${userId}`);
          setFn({ messages: res.data.result });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          setFn({ isMessagesLoading: false });
        }
      },

      sendMessage: async (messageData) => {
        const { selectedUser, messages } = getFn();

        try {
          const res = await axiosInstance.post(
            `/chat/send/${selectedUser._id}`,
            messageData
          );
          setFn({ messages: [...messages, res.data.result] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },

      subscribeToMessages: () => {
        const { selectedUser } = getFn();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("new-message", (newMessage) => {
          if (newMessage?.fromId !== selectedUser._id) return;
          setFn({ messages: [...getFn().messages, newMessage] });
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("new-messages");
      },

      setSelectedUser: (selectedUser) => setFn({ selectedUser }),
    }),
    {
      name: "selected_user",
      partialize: (state) => ({ selectedUser: state.selectedUser }),
    }
  )
);
