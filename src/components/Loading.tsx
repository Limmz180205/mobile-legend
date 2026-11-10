import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Memuat data dari server..." }: LoadingProps) {
  return (
    <View style={localStyles.container}>
      <ActivityIndicator size="large" color="#facc15" />
      <Text style={localStyles.text}>{message}</Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#94a3b8",
    marginTop: 12,
    fontSize: 14,
  },
});

