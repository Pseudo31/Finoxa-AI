import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL;

const useUserStore = create((set, get) => ({
    success: null,
    message: null,
    data: null,
    isLoading: false,
    getUser: async (token) => {
        set({ isLoading: true, success: null, message: null });
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                set({ ...data, isLoading: false });
                throw new Error(data.message);
            }

            set({
                success: true,
                data: data.data,
                isLoading: false,
            });
        } catch (error) {
            set({
                success: false,
                message: error.message,
                isLoading: false,
            });
        }
    },
    generateAPIKey: async (token) => {
        set({ isLoading: true, success: null, message: null });
        try {
            const response = await fetch(`${API_URL}/user/generate-apikey`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                set({ ...data, isLoading: false });
                throw new Error(data.message);
            }

            get().getUser(token);
        } catch (error) {
            set({
                success: false,
                message: error.message,
                isLoading: false,
            });
        }
    },
    deleteAPIKey: async (token) => {
        try {
            const response = await fetch(`${API_URL}/user/delete-apikey`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                set({ ...data });
                throw new Error(data.message);
            }

            get().getUser(token);
        } catch (error) {
            set({
                success: false,
                message: error.message,
                isLoading: false,
            });
        }
    },
}));

export default useUserStore;
