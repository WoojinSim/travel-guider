// LoginPage.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { FormEvent, useState } from "react";

const LoginPage: React.FC = (props) => {
  const [inputID, setInputID] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [warnMessage, setWarnMessage] = useState<string>("");
  const [warnAnimation, setWarnAnimation] = useState<string>("");
  const { handleLogin } = useAuth();

  const updateWarnMessage = (msg: string) => {
    setWarnMessage(msg);
    setWarnAnimation("active");
    setTimeout(() => setWarnAnimation(""), 600);
  };

  const handleIdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputID(e.target.value);
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };

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
    if (!handleResule.success) {
      updateWarnMessage("ID를 입력해주세요");
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
