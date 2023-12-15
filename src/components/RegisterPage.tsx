// RegisterPage.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { FormEvent, useState } from "react";

const RegisterPage: React.FC = (props) => {
  const [inputID, setInputID] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputPasswordRepeat, setInputPasswordRepeat] = useState<string>("");
  const [warnMessage, setWarnMessage] = useState<string>("");
  const [warnAnimation, setWarnAnimation] = useState<string>("");
  const { handleRegister } = useAuth();
  const movePage = useNavigate();

  const idRegex = /^[a-z]+[a-z0-9]{3,19}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{7,19}$/;

  // 예외처리 에러 메세지 애니메이션 + 업데이트
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
  const handlePasswordRepeatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPasswordRepeat(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 아이디 예외처리
    if (!inputID) {
      updateWarnMessage("ID를 입력해주세요");
      return;
    }
    if (!idRegex.test(inputID)) {
      updateWarnMessage("ID는 영문 4~20글자 사이여야만 합니다");
      return;
    }

    // 비밀번호 예외처리
    if (!inputPassword) {
      updateWarnMessage("비밀번호를 입력해주세요");
      return;
    }
    if (inputPassword.length < 8 || inputPassword.length > 20) {
      updateWarnMessage("비밀번호는 8~20글자 사이여야만 합니다");
      return;
    }
    if (!passwordRegex.test(inputPassword)) {
      updateWarnMessage("비밀번호는 영문과 숫자가 포함되어야 합니다");
      return;
    }

    // 비밀번호 재입력 예외처리
    if (!inputPasswordRepeat) {
      updateWarnMessage("비밀번호를 확인해주세요");
      return;
    }
    if (inputPassword !== inputPasswordRepeat) {
      updateWarnMessage("비밀번호가 일치하지 않습니다");
      return;
    }

    // 회원가입 시도
    setWarnMessage("");
    const handleResule = await handleRegister(inputID, inputPassword);
    if (handleResule.success) {
      movePage("/LoginPage");
    }
    console.log(handleResule.cause);
  };

  return (
    <div className="registerpage-wrap">
      <div className="register-box">
        <span className="register-title">Register</span>
        <div className="warn-msg-box">
          <span className={`warn-msg-label ${warnAnimation}`}>{warnMessage}</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input className="register-input" type="text" placeholder="ID" value={inputID} onChange={handleIdInputChange}></input>
          <input
            className="register-input"
            type="password"
            placeholder="비밀번호"
            value={inputPassword}
            onChange={handlePasswordInputChange}
          ></input>
          <input
            className="register-input"
            type="password"
            placeholder="비밀번호 확인"
            value={inputPasswordRepeat}
            onChange={handlePasswordRepeatInputChange}
          ></input>
          <input className="register-submit-btn" type="submit" value="확인"></input>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
