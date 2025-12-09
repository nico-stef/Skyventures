import * as SecureStore from "expo-secure-store";

// Decode JWT token (only works for standard JWT format)
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

export const getAuthHeaders = async () => {
    const token = await SecureStore.getItemAsync("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const fetchWithAuth = async (url, options = {}) => {
    const headers = await getAuthHeaders();

    return fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });
};