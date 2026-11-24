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

// ===== SCREEN: REGISTER (Modul 4: Supabase Auth Flow - Sign Up) =====
export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, authActionLoading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const handleRegister = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password || !confirmPassword) {
      setErrorMessage("Semua kolom formulir pendaftaran wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal harus 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    const { data, error } = await signUp(trimmedEmail, password);

    if (error) {
      setErrorMessage(error.message || "Gagal mendaftar akun. Silakan coba lagi.");
    } else {
      // Jika email confirmation tidak aktif, session langsung terbuat
      if (data?.session) {
        setSuccessMessage("Pendaftaran berhasil! Mengalihkan ke aplikasi...");
        setTimeout(() => {
          router.replace("/");
        }, 1200);
      } else {
        // Jika Supabase membutuhkan konfirmasi email
        setSuccessMessage(
          "Pendaftaran berhasil! Silakan periksa kotak masuk email Anda untuk konfirmasi, lalu lakukan login."
        );
      }
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
            <Ionicons name="person-add" size={48} color="#facc15" />
            <Text style={styles.authTitle}>Buat Akun Baru</Text>
            <Text style={styles.authSubtitle}>
              Daftar untuk Menyimpan Favorit & Mengakses Statistik
            </Text>
          </View>

          {/* Banner jika .env belum diatur */}
          {!configured && (
            <View style={styles.authNoticeBox}>
              <Text style={styles.authNoticeText}>
                ⚠️ <Text style={{ fontWeight: "bold" }}>Catatan Praktikum:</Text> Pastikan
                nilai <Text style={{ fontFamily: "monospace", color: "#facc15" }}>EXPO_PUBLIC_SUPABASE_URL</Text>{" "}
                sudah sesuai pada file .env.
              </Text>
            </View>
          )}

          {/* Form Email */}
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

          {/* Form Password */}
          <Text style={styles.authLabel}>Kata Sandi (min. 6 karakter)</Text>
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

          {/* Form Konfirmasi Password */}
          <Text style={styles.authLabel}>Konfirmasi Kata Sandi</Text>
          <View style={styles.authInputRow}>
            <Ionicons
              name="checkmark-circle-outline"
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
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!authActionLoading}
            />
          </View>

          {/* Pesan Kesalahan */}
          {errorMessage && (
            <View style={styles.authErrorBox}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text style={styles.authErrorText}>{errorMessage}</Text>
            </View>
          )}

          {/* Pesan Sukses */}
          {successMessage && (
            <View
              style={[
                styles.authNoticeBox,
                {
                  backgroundColor: "rgba(34, 197, 94, 0.15)",
                  borderColor: "#22c55e",
                },
              ]}
            >
              <Text style={[styles.authNoticeText, { color: "#86efac" }]}>
                {successMessage}
              </Text>
            </View>
          )}

          {/* Tombol Submit Register (dengan loading state) */}
          <Pressable
            style={[
              styles.authSubmitBtn,
              authActionLoading && styles.authSubmitBtnDisabled,
            ]}
            onPress={handleRegister}
            disabled={authActionLoading}
          >
            {authActionLoading ? (
              <ActivityIndicator color="#0b1020" size="small" />
            ) : (
              <Text style={styles.authSubmitBtnText}>Daftar Sekarang</Text>
            )}
          </Pressable>

          {/* Navigasi ke Halaman Login */}
          <View style={styles.authSwitchRow}>
            <Text style={styles.authSwitchText}>Sudah memiliki akun?</Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.authSwitchLink}>Masuk di sini</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

