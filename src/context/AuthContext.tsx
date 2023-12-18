// AuthContext.tsx

import { ReactNode, createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { promises } from "dns";

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
interface newsData {
  title: string;
  content: string;
  date: string;
  link: string;
}
interface AuthContextProps {
  id: string;
  isLoggedIn: boolean;
  userFavList: string[];
  handleLogin: (id: string, password: string) => Promise<loginResult>;
  handleRegister: (id: string, password: string) => Promise<registerResult>;
  handleLogout: () => void;
  handleGetFavList: (id: string) => Promise<string[]>;
  handleToggleFav: (iso: string) => void;
  handleGetTravelNews: (iso: string) => Promise<newsData[]>;
  handleGetGeneralNews: (iso: string) => Promise<newsData[]>;
  handleGetCrimeRata: (iso: string) => Promise<string>;
}

// Context 선언
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Provider 커스텀 훅
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userFavList, setUserFavList] = useState<string[]>([]);

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

      const responseData = response.data;

      if (response.status === 200) {
        setIsLoggedIn(true);
        setId(id);
        return { success: true, userID: id };
      } else if (response.status === 202) {
        switch (responseData.reason) {
          case "WRONG_PASSWORD":
            return {
              success: false,
              cause: "비밀번호가 올바르지 않습니다",
            };
          case "INVALID_ID":
            return {
              success: false,
              cause: "등록되지 않은 아이디입니다",
            };
          default:
            return {
              success: false,
              cause: "문제가 발생했습니다.",
            };
        }
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

      const responseData = response.data;

      if (response.status === 201) {
        return { success: true };
      } else if (response.status === 202) {
        switch (responseData.reason) {
          case "ID_EXISTS":
            return {
              success: false,
              cause: "이미 등록된 아이디입니다",
            };
          default:
            return {
              success: false,
              cause: "문제가 발생했습니다.",
            };
        }
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
    setIsLoggedIn(false);
    setId("");
  };

  /**
   * 즐겨찾기 목록 get 핸들러
   * @param id 사용자 ID
   * @returns 즐겨찾기된 국가 ISO 코드 배열
   */
  const handleGetFavList = async (id: string): Promise<string[]> => {
    let resultArray: string[] = [];
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
        const responseData = responseFavList.data;

        for (let index in responseData) {
          resultArray.push(responseData[index].fields.isocode);
        }
        setUserFavList(resultArray);
        return resultArray;
      } catch (error) {
        console.log(error);
        return resultArray;
      }
    } else {
      return resultArray;
    }
  };

  /**
   * 즐겨찾기 Toggle 핸들러
   * @param iso 국가 코드
   * @returns void
   */
  const handleToggleFav = async (iso: string) => {
    if (isLoggedIn) {
      try {
        if (userFavList.includes(iso)) {
          // 즐겨찾기 삭제
          const responseFavList = await axios.post(
            "http://52.78.43.199:8000/data/favlist/delete",
            JSON.stringify({
              id: id,
              isocode: iso,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          // 즐겨찾기 추가
          const responseFavList = await axios.post(
            "http://52.78.43.199:8000/data/favlist/insert",
            JSON.stringify({
              id: id,
              isocode: iso,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }
        handleGetFavList(id);
        return;
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  const handleGetTravelNews = async (iso: string): Promise<newsData[]> => {
    try {
      const responseList = await axios.post(
        "http://52.78.43.199:8000/data/travelnews/search",
        JSON.stringify({
          isocode: iso,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return responseList.data?.results;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleGetGeneralNews = async (iso: string): Promise<newsData[]> => {
    try {
      const responseList = await axios.post(
        "http://52.78.43.199:8000/data/generalnews/search",
        JSON.stringify({
          isocode: iso,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return responseList.data?.results;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleGetCrimeRata = async (iso: string): Promise<string> => {
    try {
      const regionListRaw = await axios.get("http://52.78.43.199:8000/data/nationdata/");
      const regionList = regionListRaw.data;
      for (let index in regionList) {
        if (regionList[index].isocode === iso) {
          return `${regionList[index].crimerate2023}%`;
        }
      }
      return "오류";
    } catch (error) {
      console.log(error);
      return "오류";
    }
  };

  // Context value값 정리
  const contextValue: AuthContextProps = {
    id,
    isLoggedIn,
    userFavList,
    handleLogin,
    handleRegister,
    handleLogout,
    handleGetFavList,
    handleToggleFav,
    handleGetTravelNews,
    handleGetGeneralNews,
    handleGetCrimeRata,
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
