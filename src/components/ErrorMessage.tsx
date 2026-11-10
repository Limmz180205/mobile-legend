import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View style={localStyles.container}>
      <Ionicons name="alert-circle-outline" size={42} color="#ef4444" />
      <Text style={localStyles.title}>Terjadi Kesalahan</Text>
      <Text style={localStyles.message}>{message}</Text>
      {onRetry ? (
        <Pressable style={localStyles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color="#0b1020" />
          <Text style={localStyles.retryText}>Coba Lagi</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#f87171",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  message: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 6,
    fontSize: 13,
  },
  retryButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#facc15",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  retryText: {
    color: "#0b1020",
    fontWeight: "bold",
    fontSize: 13,
  },
});

