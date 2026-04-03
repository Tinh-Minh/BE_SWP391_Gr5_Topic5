import axios from "axios";
import api from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, {
    username,
    password,
  });
  const token = res.data.token;
  if (!token) throw new Error("No token");
  localStorage.setItem("token", token);

  // Lấy profile sau khi login
  const profileRes = await api.get("/customer/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  localStorage.setItem("user", JSON.stringify(profileRes.data));
  return profileRes.data;
};


export const loginWithGoogle = async (credential) => {
  try {
    const res = await axios.post(`${API_URL}/auth/google`, { credential });
    const token = res.data.token;
    if (!token) throw new Error("No token");

    localStorage.setItem("token", token);

    // Decode JWT để lấy username và role
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const user = {
      username: payload?.sub,
      role:     payload?.role || "USER",
      name:     payload?.sub,
    };

    // Với USER role thì lấy thêm profile
    if (user.role === "USER") {
      try {
        const profileRes = await axios.get(`${API_URL}/customer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Object.assign(user, profileRes.data);
      } catch {}
    }

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (err) {
    const message = err.response?.data?.error || err.response?.data?.message || "Đăng nhập Google thất bại.";
    throw new Error(message);
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const getToken = () => localStorage.getItem("token");
export const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};