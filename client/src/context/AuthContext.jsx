import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE =  "http://localhost:5000/api";

const AuthContext = createContext(null);

// Optional: export a handy hook
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isLoading, setIsLoading] = useState(!!token); // if we have a token, try fetching /me

  // Create a dedicated axios instance
  const http = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE,
      headers: { "Content-Type": "application/json" },
      withCredentials: false,
    });

    // Attach token
    instance.interceptors.request.use((config) => {
      const t = localStorage.getItem("token");
      if (t) config.headers.Authorization = `Bearer ${t}`;
      return config;
    });

    // Auto-logout on 401
    instance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );

    return instance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch current user if we have a token
  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await http.get("/auth/me"); // make sure your backend exposes this
        // Expect data like: { _id, name, email, contact, ... }
        if (!mounted) return;
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (e) {
        // token invalid/expired
        logout();
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, [token, http]);

  // --- Actions ---
  async function register(form) {
    // form: { name, email, password, contact? }
    const { data } = await http.post("/auth/register", form);
    // Expect: { token, user }
    persistAuth(data.token, data.user);
    return data.user;
  }

  async function login(credentials) {
    // credentials: { email, password }
    const { data } = await http.post("/auth/login", credentials);
    // Expect: { token, user }
    persistAuth(data.token, data.user);
    return data.user;
  }

  async function updateProfile(patch) {
    // patch: fields to update e.g. { name, contact }
    const { data } = await http.put("/auth/me", patch);
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    return data;
  }

  function persistAuth(t, u) {
    setToken(t);
    setUser(u);
    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(u));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      updateProfile,
      logout,
      http, // expose axios instance if you want to reuse it elsewhere
    }),
    [user, token, isLoading, http]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
