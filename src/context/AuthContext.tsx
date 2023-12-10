// AuthContext.tsx

import { ReactNode, createContext, useContext, useState } from "react";

// 인터페이스
interface AuthContextProps {
  id: string | null;
  isLoggedIn: boolean;
  login: (id: string, password: string) => void;
  logout: () => void;
}

// Context 선언
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const login = (id: string, password: string) => {
    setId(id);
  };
  const logout = () => {
    setId(null);
  };

  const contextValue: AuthContextProps = {
    id,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={contextValue}></AuthContext.Provider>;
};

// 커스텀 훅 useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider와 같이 사용되어야만 합니다.");
  }

  return context;
};
