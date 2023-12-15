// AuthContext.tsx

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// 인터페이스
interface registerResult {
  success: boolean;
  cause?: string;
}
interface loginResult {
  success: boolean;
  userID?: string;
  cause?: string;
}
interface AuthContextProps {
  id: string;
  isLoggedIn: boolean;
  handleLogin: (id: string, password: string) => Promise<loginResult>;
  handleRegister: (id: string, password: string) => Promise<registerResult>;
  handleLogout: () => void;
  handleGetFavList: (id: string) => Promise<void>;
}

// Context 선언
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider 커스텀 훅
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  /**
   * 로그인 서버 통신 핸들러
   * @param id 사용자 입력 ID
   * @param password 사용자 입력 비밀번호
   * @returns success - 성공여부<boolean>, userID - 사용자ID<string>, cause - 실패사유<string>
   */
  const handleLogin = async (id: string, password: string): Promise<loginResult> => {
    try {
      const response = await axios.post(
        "http://52.78.43.199:8000/data/userdata/login",
        JSON.stringify({
          id: id,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const responseData = response.data; // 사용자 데이터 가져오기
        // TODO: 서버에서 전송한 사용자 데이터를 기반으로 데이터 입력 및 반환하게 하기
        setIsLoggedIn(true);
        setId(id);
        return { success: true, userID: id };
      } else {
        return {
          success: false,
          cause: `로그인이 정상적으로 처리되지 않았습니다 (${response.status})`,
        };
      }
    } catch (error) {
      return {
        success: false,
        cause: `서버 에러 (${error})`,
      };
    }
  };

  /**
   * 회원가입 서버 통신 핸들러
   * @param id 사용자 입력 ID
   * @param password 사용자 입력 비밀번호
   * @returns success - 성공여부<boolean>, cause - 실패사유<string>
   */
  const handleRegister = async (id: string, password: string): Promise<registerResult> => {
    try {
      const response = await axios.post(
        "http://52.78.43.199:8000/data/userdata/register",
        JSON.stringify({
          id: id,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        return { success: true };
      } else {
        return {
          success: false,
          cause: `회원가입이 정상적으로 처리되지 않았습니다 (${response.status})`,
        };
      }
    } catch (error) {
      console.error(`서버 에러: ${error}`);
      return {
        success: false,
        cause: `서버 에러 (${error})`,
      };
    }
  };

  /***
   * 로그아웃 핸들러
   */
  const handleLogout = () => {
    // TODO: 로그아웃 코드 작성
  };

  /***
   * 즐겨찾기 리스트 get 핸들러
   */
  const handleGetFavList = async (id: string) => {
    if (isLoggedIn) {
      try {
        const responseFavList = await axios.post(
          "http://52.78.43.199:8000/data/favlist/search",
          JSON.stringify({
            id: id,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return;
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  /***
   * 즐겨찾기 국가 toggle 핸들러
   */
  const handleToggleFav = (iso: string) => {
    // TODO: 즐겨찾기 국가등록 토글 코드 작성
  };

  // Context value값 정리
  const contextValue: AuthContextProps = {
    id,
    isLoggedIn,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGetFavList,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// 커스텀 훅 useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider의 내부에서 사용되어야만 합니다.");
  }
  return context;
};
