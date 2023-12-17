// LoginPage.jsx

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";

const LoginPage: React.FC = (props) => {
  const [inputID, setInputID] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [warnMessage, setWarnMessage] = useState<string>("");
  const [warnAnimation, setWarnAnimation] = useState<string>("");
  const { handleLogin, handleGetFavList, isLoggedIn } = useAuth();
  const movePage = useNavigate();

  // 오류&경고 메세지 업데이트 핸들러
  const updateWarnMessage = (msg: string) => {
    setWarnMessage(msg);
    setWarnAnimation("active");
    setTimeout(() => setWarnAnimation(""), 600);
  };

  // ID 입력 폼 업데이트 핸들러
  const handleIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputID(e.target.value);
  };
  // 비밀번로 입력 폼 업데이트 핸들러
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };

  // 로그인 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 예외처리
    if (!inputID) {
      updateWarnMessage("ID를 입력해주세요");
      return;
    }
    if (!inputPassword) {
      updateWarnMessage("비밀번호를 입력해주세요");
      return;
    }

    // 로그인 시도
    setWarnMessage("");
    const handleResule = await handleLogin(inputID, inputPassword);
    if (handleResule.success) {
      // Promis 로 반환하기에 성공여부 꼭 확인 후 진행
      movePage("/");
    } else {
      updateWarnMessage(`${handleResule.cause}`);
      return;
    }
  };

  return (
    <div className="loginpage-wrap">
      <div className="login-box">
        <span className="login-title">Login</span>
        <div className="warn-msg-box">
          <span className={`warn-msg-label ${warnAnimation}`}>{warnMessage}</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input className="login-input" type="text" placeholder="ID" value={inputID} onChange={handleIdInputChange}></input>
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호"
            value={inputPassword}
            onChange={handlePasswordInputChange}
          ></input>
          <input className="login-submit-btn" type="submit" value="확인"></input>
        </form>
        <Link className="register-label" to={"/RegisterPage"}>
          회원가입
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
