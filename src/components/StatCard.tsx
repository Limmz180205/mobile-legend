import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SummaryItem } from "../constants/types";

interface StatCardProps {
  item: SummaryItem;
}

export default function StatCard({ item }: StatCardProps) {
  return (
    <View style={localStyles.card}>
      <Ionicons name={item.icon} size={20} color="#facc15" />
      <Text style={localStyles.value}>{item.value}</Text>
      <Text style={localStyles.label}>{item.label}</Text>
    </View>
  );
}

const localStyles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#334155",
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
  },
  label: {
    color: "#94a3b8",
    fontSize: 11,
    marginTop: 2,
  },
});

