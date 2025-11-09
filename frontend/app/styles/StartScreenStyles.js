import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const StartScreenStyles = StyleSheet.create({
    backgroundStart: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
    },

    logoContainerStart: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    logoStart: {
        width: width * 0.5,
        height: width * 0.5,
        resizeMode: "contain",
        marginBottom: 10,
        alignSelf: "center",
    },

    logoTextStart: {
        fontSize: 42,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 1,
        textAlign: "center",
        marginTop: 10,
    },

    registerContainerStart: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
        width: "100%",
    },

    registerButtonStart: {
        backgroundColor: "#ffffff",
        paddingVertical: 18,
        paddingHorizontal: 60,
        borderRadius: 14,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        marginBottom: 20,
        width: "100%",
        maxWidth: 350,
        elevation: 6,
    },

    registerTextStart: {
        color: "#004aad",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },

    loginButtonStart: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
        width: "100%",
        maxWidth: 350,
    },

    loginTextStart: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
    },
});