// MyPage.jsx

import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const MyPage: React.FC = (props) => {
  const { handleGetFavList, id } = useAuth();
  handleGetFavList(id);
  return (
    <div className="mypage-wrap">
      <></>
    </div>
  );
};

export default MyPage;
