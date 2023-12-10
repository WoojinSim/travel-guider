// AuthContext.tsx

import { ReactNode, createContext, useContext, useState } from "react";
import axios from "axios";

// 인터페이스
interface AuthContextProps {
  id: string | null;
  isLoggedIn: boolean;
  handleLogin: (id: string, password: string) => void;
  handleRegister: (id: string, password: string) => void;
  handleLogout: () => void;
}

// Context 선언
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = async (id: string, password: string) => {
    // 로그인 코드
    console.log(`AuthContext_login_응답: '${id}' / '${password}'`);
    try {
      const response = await axios.post("TEST_HOST", {
        id: id,
        password: password,
      });

      if (response.status === 201) {
        console.log("회원가입 성공!");
      } else {
        console.error("회원가입 실패");
      }
    } catch (error) {
      console.error(`서버 에러: ${error}`);
    }
  };

  const handleLogout = () => {
    // 로그아웃 코드
  };

  const handleRegister = async (id: string, password: string) => {
    // 회원가입 코드
    console.log(`AuthContext_register_응답: '${id}' / '${password}'`);
    try {
      const response = await axios.post("TEST_HOST", {
        id: id,
        password: password,
      });

      if (response.status === 201) {
        console.log("회원가입 성공!");
      } else {
        console.error("회원가입 실패");
      }
    } catch (error) {
      console.error(`서버 에러: ${error}`);
    }
  };

  const contextValue: AuthContextProps = {
    id,
    isLoggedIn,
    handleLogin,
    handleRegister,
    handleLogout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// 커스텀 훅 useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider와 같이 사용되어야만 합니다.");
  }

  return context;
};
