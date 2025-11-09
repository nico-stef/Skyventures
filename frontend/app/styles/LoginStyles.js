import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const loginStyles = StyleSheet.create({
    background: {
        flex: 1,
        width: "100%",
        height: "100%",
    },

    logoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: height * 0.1,
    },

    logo: {
        width: width * 0.5,
        height: width * 0.5,
        resizeMode: "contain",
        marginBottom: 20,
    },

    welcomeText: {
        fontSize: 28,
        fontWeight: "600",
        color: "#ffffff",
        textAlign: "center",
        letterSpacing: 0.5,
    },

    loginContainer: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: height * 0.05,
        paddingHorizontal: 30,
    },

    credentialsContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: 20,
        padding: 25,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    inputControl: {
        height: 55,
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        paddingHorizontal: 18,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        color: "#333",
    },

    loginButton: {
        height: 55,
        backgroundColor: "#004aad",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#004aad",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },

    loginButtonText: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "600",
        letterSpacing: 0.5,
    },

    registerContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
    },

    registerText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "500",
    },
});