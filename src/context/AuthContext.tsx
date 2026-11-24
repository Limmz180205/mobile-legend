import {
  AuthError,
  AuthResponse,
  Session,
  User,
} from "@supabase/supabase-js";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "../services/supabase";

// ===== INTERFACE AUTH CONTEXT (Modul 4: Global AuthContext) =====
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean; // Loading awal pengecekan token/sesi
  authActionLoading: boolean; // Loading saat submit Login/Register/Logout
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | Error | null }>;
  signUp: (email: string, password: string) => Promise<{ data: any; error: AuthError | Error | null }>;
  signOut: () => Promise<{ error: AuthError | Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authActionLoading, setAuthActionLoading] = useState<boolean>(false);

  // ===== REAL-TIME SESSION SUBSCRIPTION (Modul 4) =====
  useEffect(() => {
    let isMounted = true;

    // 1. Ambil session awal yang tersimpan di SecureStore via Supabase SDK
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("[Auth] Gagal mengambil sesi tersimpan:", error.message);
        }
        if (isMounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.warn("[Auth] Terjadi kesalahan inisialisasi sesi:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // 2. Real-time Subscription ke Supabase Auth State Change
    // Listener ini otomatis aktif ketika ada event: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (isMounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
      }
    });

    // Cleanup subscription saat komponen unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ===== SUPABASE AUTH FLOW: SIGN IN =====
  const signIn = async (
    email: string,
    password: string
  ): Promise<{ data: any; error: AuthError | Error | null }> => {
    setAuthActionLoading(true);
    try {
      const response: AuthResponse = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (response.error) {
        return { data: null, error: response.error };
      }

      setSession(response.data.session);
      setUser(response.data.user);
      return { data: response.data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error("Gagal melakukan login"),
      };
    } finally {
      setAuthActionLoading(false);
    }
  };

  // ===== SUPABASE AUTH FLOW: SIGN UP =====
  const signUp = async (
    email: string,
    password: string
  ): Promise<{ data: any; error: AuthError | Error | null }> => {
    setAuthActionLoading(true);
    try {
      const response = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (response.error) {
        return { data: null, error: response.error };
      }

      // Jika auto-confirm aktif, session langsung terisi
      if (response.data.session) {
        setSession(response.data.session);
        setUser(response.data.user);
      }
      return { data: response.data, error: null };
    } catch (err: any) {
      return {
        data: null,
        error:
          err instanceof Error ? err : new Error("Gagal mendaftarkan akun"),
      };
    } finally {
      setAuthActionLoading(false);
    }
  };

  // ===== SUPABASE AUTH FLOW: SIGN OUT =====
  const signOut = async (): Promise<{ error: AuthError | Error | null }> => {
    setAuthActionLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn("[Auth] Peringatan saat signOut Supabase:", error.message);
      }
      setSession(null);
      setUser(null);
      return { error: null };
    } catch (err: any) {
      setSession(null);
      setUser(null);
      return {
        error:
          err instanceof Error ? err : new Error("Gagal melakukan logout"),
      };
    } finally {
      setAuthActionLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        authActionLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook untuk mengakses AuthContext di seluruh komponen/screen
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam <AuthProvider>");
  }
  return context;
}

