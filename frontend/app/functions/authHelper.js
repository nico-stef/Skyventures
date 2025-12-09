export const decodeToken = (token) => {
    try {
        const base64Payload = token.split('.')[1]; //JWT-ul are formatul header.payload.signature
        const jsonPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/')); //convertim din Base64 URL-safe in Base64 normal
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};
