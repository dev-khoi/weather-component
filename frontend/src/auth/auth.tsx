// src/context/AuthContext.tsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/checkAuth", {
        withCredentials: true, // 👈 send cookie
      })
      .then((res) => {
        setIsAuthenticated(res.data.authenticated === true);
      })
      .catch((err) => {
        console.error("Auth check failed", err);
        setIsAuthenticated(false);
      })
     ;
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook for checking authentication

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
            throw new Error('useAuth must be used within an AuthProvider')

    }
    return context
}

