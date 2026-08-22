import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  aiSuggestions: [],
  isAiSuggestionsLoading: false,
  aiSuggestionsError: "",
  aiReplySourceMessage: null,
  previews: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
      get().loadPreviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  loadPreviews: async () => {
    const { users, previews } = get();
    const missing = users.filter((u) => !(u._id in previews));
    if (!missing.length) return;

    const results = await Promise.all(
      missing.map(async (user) => {
        try {
          const res = await axiosInstance.get(`/messages/${user._id}`);
          const last = res.data?.[res.data.length - 1];
          return [
            user._id,
            last
              ? { text: last.text || "", hasImage: Boolean(last.image), createdAt: last.createdAt }
              : null,
          ];
        } catch {
          return [user._id, null];
        }
      })
    );

    const next = { ...get().previews };
    for (const [userId, preview] of results) next[userId] = preview;
    set({ previews: next });
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      const last = res.data?.[res.data.length - 1];
      set({
        previews: {
          ...get().previews,
          [userId]: last
            ? { text: last.text || "", hasImage: Boolean(last.image), createdAt: last.createdAt }
            : null,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({
        messages: [...messages, res.data],
        aiSuggestions: [],
        aiReplySourceMessage: null,
        aiSuggestionsError: "",
        previews: {
          ...get().previews,
          [selectedUser._id]: {
            text: res.data.text || "",
            hasImage: Boolean(res.data.image),
            createdAt: res.data.createdAt,
          },
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  requestAiReplySuggestions: async (message) => {
    const { selectedUser, messages } = get();
    if (!selectedUser || !message) return;

    set({
      isAiSuggestionsLoading: true,
      aiSuggestionsError: "",
      aiReplySourceMessage: message,
      aiSuggestions: [],
    });

    try {
      const recentMessages = messages.slice(-6).map((item) => ({
        senderId: String(item.senderId),
        text: item.text || "",
        image: item.image || "",
      }));

      const res = await axiosInstance.post("/messages/ai-suggestions", {
        messageText: message.text || "",
        senderName: selectedUser.fullName || "them",
        receiverName: useAuthStore.getState().authUser?.fullName || "you",
        recentMessages,
      });

      set({
        aiSuggestions: res.data?.suggestions || [],
        aiSuggestionsError:
          res.data?.suggestions?.length > 0 ? "" : "No suggestions returned right now.",
      });
    } catch (error) {
      set({
        aiSuggestionsError:
          error.response?.data?.message || "AI suggestions are unavailable right now.",
      });
    } finally {
      set({ isAiSuggestionsLoading: false });
    }
  },

  clearAiReplySuggestions: () =>
    set({
      aiSuggestions: [],
      aiSuggestionsError: "",
      aiReplySourceMessage: null,
      isAiSuggestionsLoading: false,
    }),

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
        previews: {
          ...get().previews,
          [newMessage.senderId]: {
            text: newMessage.text || "",
            hasImage: Boolean(newMessage.image),
            createdAt: newMessage.createdAt,
          },
        },
      });

      get().requestAiReplySuggestions(newMessage);
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },

  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      messages: [],
      aiSuggestions: [],
      aiSuggestionsError: "",
      aiReplySourceMessage: null,
      isAiSuggestionsLoading: false,
    }),
}));
