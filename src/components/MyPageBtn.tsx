// MyPageBtn.jsx

import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const MyPageBtn: React.FC = (props) => {
  const { isLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn && (
        <Link className="mypage-btn-wrap" to={"/MyPage"}>
          MyPage
        </Link>
      )}
      {!isLoggedIn && (
        <Link className="mypage-btn-wrap" to={"/LoginPage"}>
          Login
        </Link>
      )}
    </>
  );
};

export default MyPageBtn;
