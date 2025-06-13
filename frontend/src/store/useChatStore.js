import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { UseAuthStore } from "./UseAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      
      // Debug logs - fixed to use res.data instead of undefined 'data'
      console.log('API Response:', res.data);
      console.log('Type of data:', typeof res.data);
      console.log('Is array:', Array.isArray(res.data));
      
      // Safety check to ensure we're setting an array
      if (Array.isArray(res.data)) {
        set({ users: res.data });
      } else {
        console.error('Expected array but got:', typeof res.data, res.data);
        set({ users: [] }); // Fallback to empty array
        toast.error("Invalid data format received from server");
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ users: [] }); // Set empty array on error
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      
      // Safety check for messages too
      if (Array.isArray(res.data)) {
        set({ messages: res.data });
      } else {
        console.error('Expected array but got:', typeof res.data, res.data);
        set({ messages: [] });
        toast.error("Invalid message data format received");
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ messages: [] });
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = UseAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      console.log('hello ', newMessage.senderId, selectedUser._id);
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = UseAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));