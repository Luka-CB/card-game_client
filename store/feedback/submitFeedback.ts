import api from "@/utils/axios";
import { AxiosError } from "axios";
import { create } from "zustand";

interface FeedbackData {
  name?: string;
  email?: string;
  type: string;
  message: string;
  browserInfo?: {
    userAgent: string;
    language: string;
    screen: {
      width: number;
      height: number;
    };
  } | null;
}

interface FeedbackStore {
  status: "idle" | "loading" | "success" | "failed";
  successMessage: string | null;
  errorMessage: string | null;
  submitFeedback: (feedbackData: FeedbackData) => Promise<void>;
}

const useFeedbackStore = create<FeedbackStore>((set) => ({
  status: "idle",
  successMessage: null,
  errorMessage: null,
  submitFeedback: async (feedbackData: FeedbackData) => {
    set({ status: "loading", successMessage: null, errorMessage: null });
    try {
      const { data } = await api.post("/feedback", feedbackData);
      set({
        status: "success",
        successMessage: data.message,
        errorMessage: null,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({
          errorMessage: error.response?.data?.error?.message || error.message,
          status: "failed",
          successMessage: null,
        });
      } else {
        set({
          errorMessage: "An unexpected error occurred",
          status: "failed",
          successMessage: null,
        });
      }
    }
  },
}));

export default useFeedbackStore;
