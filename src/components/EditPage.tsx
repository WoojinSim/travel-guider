// RegisterPage.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { FormEvent, useState } from "react";

const RegisterPage: React.FC = (props) => {
  const [inputPastPassword, setInputPastPassword] = useState<string>("");
  const [inputPassword, setInputPassword] = useState<string>("");
  const [inputPasswordRepeat, setInputPasswordRepeat] = useState<string>("");
  const [warnMessage, setWarnMessage] = useState<string>("");
  const [warnAnimation, setWarnAnimation] = useState<string>("");
  const { isLoggedIn, id, handleEdit, handleResign } = useAuth();
  const movePage = useNavigate();

  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{7,19}$/;

  // 예외처리 에러 메세지 애니메이션 + 업데이트
  const updateWarnMessage = (msg: string) => {
    setWarnMessage(msg);
    setWarnAnimation("active");
    setTimeout(() => setWarnAnimation(""), 600);
  };
  const handlePastPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPastPassword(e.target.value);
  };
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPassword(e.target.value);
  };
  const handlePasswordRepeatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPasswordRepeat(e.target.value);
  };

  const handleResignBtn = async () => {
    if (!isLoggedIn) {
      updateWarnMessage("로그인 후 사용해주세요");
      return;
    }
    if (!inputPastPassword) {
      updateWarnMessage("현재 비밀번호를 입력해주세요");
      return;
    }
    let resignConfirm = window.confirm("정말 탈퇴 하시겠습니까?");
    if (!resignConfirm) {
      return;
    }

    // 회원탈퇴 시도
    setWarnMessage("");
    const handleResule = await handleResign(id, inputPastPassword);
    if (handleResule.success) {
      alert("성공적으로 회원 탈퇴 되었습니다.");
      movePage("/");
    }
    updateWarnMessage(`${handleResule.cause}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      updateWarnMessage("로그인 후 사용해주세요");
      return;
    }
    // 아이디 예외처리
    if (!inputPastPassword) {
      updateWarnMessage("현재 비밀번호를 입력해주세요");
      return;
    }

    // 비밀번호 예외처리
    if (!inputPassword) {
      updateWarnMessage("새로운 비밀번호를 입력해주세요");
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
      updateWarnMessage("새로운 비밀번호를 확인해주세요");
      return;
    }
    if (inputPassword !== inputPasswordRepeat) {
      updateWarnMessage("비밀번호가 일치하지 않습니다");
      return;
    }

    // 회원가입 시도
    setWarnMessage("");
    const handleResule = await handleEdit(id, inputPastPassword, inputPassword);
    if (handleResule.success) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      movePage("/MyPage");
    }
    updateWarnMessage(`${handleResule.cause}`);
  };

  return (
    <div className="registerpage-wrap">
      <div className="register-box">
        <span className="register-title">Edit</span>
        <div className="warn-msg-box">
          <span className={`warn-msg-label ${warnAnimation}`}>{warnMessage}</span>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="register-input"
            type="password"
            placeholder="현재 비밀번호"
            value={inputPastPassword}
            onChange={handlePastPasswordInputChange}
          ></input>
          <input
            className="register-input"
            type="password"
            placeholder="새로운 비밀번호"
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
        <span className="resign-label" onClick={handleResignBtn}>
          회원탈퇴
        </span>
      </div>
    </div>
  );
};

export default RegisterPage;
