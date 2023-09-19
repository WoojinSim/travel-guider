// TravelSafeLvl.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import cheerio from "cheerio";

interface TravelInfoProps {
  regionNCode: string;
}

const TravelInfo: React.FC<TravelInfoProps> = (props) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // 지도 모달창 노출 여부 state
  const [infoModalAnimation, setInfoModalAnimation] = useState(""); // 모달 mount 애니메이션
  const toggleMap = () => {
    // 지도 모달창 노출
    if (isInfoModalOpen) {
      setInfoModalAnimation("closeAnimation");
      setTimeout(() => {
        setIsInfoModalOpen(false);
      }, 500);
    } else {
      setIsInfoModalOpen(true);
      setInfoModalAnimation("openAnimation");
    }
  };

  useEffect(() => {
    // TODO: 백엔드 API 통신 만들어야함!!
  }, []);

  return (
    <div className="nav-section">
      <div className={"click-section " + isInfoModalOpen} onClick={toggleMap}>
        여행정보({props.regionNCode})
      </div>
    </div>
  );
};

export default TravelInfo;
