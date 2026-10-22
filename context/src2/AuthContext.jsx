import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem("isLogin") === "true";
  });

  const login = () => {
    localStorage.setItem("isLogin", "true");
    setIsLogin(true);
  };

  const logout = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider value={{ isLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
