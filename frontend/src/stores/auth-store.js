import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL;

const useAuthStore = create((set) => ({
    status: null,
    message: null,
    data: null,
    isAuthenticated: false,
    isCheckingAuth: false,
    isLoading: false,
    signup: async (name, email, password) => {
        set({ isLoading: true, status: null, message: null });
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
                redirect: "follow",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                set({ ...data, isLoading: false });
                throw new Error(data.message);
            }

            set({
                status: "success",
                data: data.data,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                status: "error",
                message: error.message,
                isLoading: false,
            });
        }
    },
    login: async (email, password) => {
        set({ isLoading: true, status: null, message: null });
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
                redirect: "follow",
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                set({ ...data, isLoading: false });
                throw new Error(data.message);
            }
            set({
                status: "success",
                data: data.data,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            set({
                status: "error",
                message: error.message,
                isLoading: false,
            });
        }
    },
    logout: async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: "GET",
                redirect: "follow",
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            set({
                status: "success",
                data: data.data,
                isAuthenticated: false,
            });
        } catch (error) {
            set({
                status: "error",
                message: error.message,
            });
        }
    },
    checkAuth: async (token) => {
        set({ isCheckingAuth: true });
        try {
            const response = await fetch(`${API_URL}/auth/check-auth`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                redirect: "follow",
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                set({ isAuthenticated: false, isCheckingAuth: false });
                throw new Error(data.detail);
            }
            set({
                status: "success",
                data: data.data,
                isAuthenticated: true,
                isCheckingAuth: false,
            });
        } catch {
            set({
                isAuthenticated: false,
                isCheckingAuth: false,
            });
        }
    },
}));

export default useAuthStore;
