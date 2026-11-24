import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "../constants/styles";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured } from "../services/supabase";

// ===== SCREEN: LOGIN (Modul 4: Supabase Auth Flow - Sign In) =====
export default function LoginScreen() {
  const router = useRouter();
  const { signIn, authActionLoading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const handleLogin = async () => {
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage("Email dan kata sandi tidak boleh kosong.");
      return;
    }

    const { error } = await signIn(trimmedEmail, password);

    if (error) {
      if (
        error.message.includes("Invalid login credentials") ||
        error.message.includes("invalid_grant")
      ) {
        setErrorMessage("Email atau kata sandi yang Anda masukkan salah.");
      } else {
        setErrorMessage(error.message || "Gagal masuk. Periksa koneksi Anda.");
      }
    } else {
      // Sukses login -> Route Protection Guard di _layout.tsx akan otomatis me-redirect ke Home
      router.replace("/");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.authContainer}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.authCard}>
          {/* Header Card */}
          <View style={styles.authHeader}>
            <Ionicons name="shield-checkmark" size={48} color="#facc15" />
            <Text style={styles.authTitle}>Masuk Akun</Text>
            <Text style={styles.authSubtitle}>
              MLBB Stats Hub • Modul 4 Supabase Auth
            </Text>
          </View>

          {/* Banner jika file .env belum dikonfigurasi */}
          {!configured && (
            <View style={styles.authNoticeBox}>
              <Text style={styles.authNoticeText}>
                ⚠️ <Text style={{ fontWeight: "bold" }}>Catatan Praktikum:</Text> Masukkan
                URL dan Anon Key Supabase Anda di file{" "}
                <Text style={{ fontFamily: "monospace", color: "#facc15" }}>.env</Text>{" "}
                agar fitur autentikasi terhubung ke database cloud Supabase.
              </Text>
            </View>
          )}

          {/* Form Fields */}
          <Text style={styles.authLabel}>Email</Text>
          <View style={styles.authInputRow}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#94a3b8"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.authInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0 }]}
              placeholder="nama@email.com"
              placeholderTextColor="#64748b"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!authActionLoading}
            />
          </View>

          <Text style={styles.authLabel}>Kata Sandi</Text>
          <View style={styles.authInputRow}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#94a3b8"
              style={{ marginRight: 8 }}
            />
            <TextInput
              style={[styles.authInput, { flex: 1, borderWidth: 0, paddingHorizontal: 0 }]}
              placeholder="••••••••"
              placeholderTextColor="#64748b"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              editable={!authActionLoading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#94a3b8"
              />
            </Pressable>
          </View>

          {/* Pesan Kesalahan */}
          {errorMessage && (
            <View style={styles.authErrorBox}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text style={styles.authErrorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Tombol Submit Masuk (dengan loading state) */}
          <Pressable
            style={[
              styles.authSubmitBtn,
              authActionLoading && styles.authSubmitBtnDisabled,
            ]}
            onPress={handleLogin}
            disabled={authActionLoading}
          >
            {authActionLoading ? (
              <ActivityIndicator color="#0b1020" size="small" />
            ) : (
              <Text style={styles.authSubmitBtnText}>Masuk ke Aplikasi</Text>
            )}
          </Pressable>

          {/* Navigasi ke Halaman Register */}
          <View style={styles.authSwitchRow}>
            <Text style={styles.authSwitchText}>Belum memiliki akun?</Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text style={styles.authSwitchLink}>Daftar Sekarang</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

