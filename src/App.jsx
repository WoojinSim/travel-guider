import React, { useState, useEffect, useRef } from "react";
import "./App.css";
// import OpenAI from "openai";
import TravelSaveLvl from "./component/TravelSafeLvl"; // 컴포넌트 파일 경로에 맞게 수정

function App() {
  const [selectedDestinationInfo, setSelectedDestinationInfo] = useState({
    name: "일본",
    regionIso: "JP",
  });

  const destinationList = [
    { value: "JP", name: "일본" },
    { value: "CN", name: "중국" },
    { value: "VN", name: "베트남" },
    { value: "RU", name: "러시아" },
  ];

  // ===
  const outerDivRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageHeight = window.innerHeight; // 윈도우 화면 세로길이 = 100vh

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const scrollTop = Math.round(outerDivRef.current.scrollTop); // 현재 스크롤 위쪽 끝부분 위치 좌표
      const amountOfChildPages = outerDivRef.current.childElementCount; // 내부 페이지 갯수

      if (deltaY > 0) {
        // 스크롤 내릴 때 (하단으로)
        for (var i = 0; i < amountOfChildPages - 1; i++) {
          if (scrollTop >= pageHeight * i && scrollTop < pageHeight * (i + 1)) {
            // 현재 위치한 페이지 파악
            outerDivRef.current.scrollTo({
              top: pageHeight * (i + 1),
              left: 0,
              behavior: "smooth",
            });
            setCurrentIndex(i + 1);
            setSelectedDestinationInfo({
              name: destinationList[i + 1].name,
              regionIso: destinationList[i + 1].value,
            });
            break;
          }
        }
      } else {
        // 스크롤 올릴 때 (상단으로)
        for (var i = 0; i < amountOfChildPages - 1; i++) {
          if (scrollTop > pageHeight * i && scrollTop <= pageHeight * (i + 1)) {
            // 현재 위치한 페이지 파악
            outerDivRef.current.scrollTo({
              top: pageHeight * i,
              left: 0,
              behavior: "smooth",
            });
            setCurrentIndex(i);
            setSelectedDestinationInfo({
              name: destinationList[i].name,
              regionIso: destinationList[i].value,
            });
            break;
          }
        }
      }
    };
    const outerDivRefCurrent = outerDivRef.current;
    outerDivRefCurrent.addEventListener("wheel", wheelHandler); // 휠 리스너 핸들
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", wheelHandler); // 휠 리스너 해제
    };
  }, []);
  // ===

  return (
    <div className="App">
      <div className="outer-base" ref={outerDivRef}>
        <div className="inner page-1">
          <div className="back-img"></div>
          <span className="region-title">일본</span>
        </div>
        <div className="inner page-2">
          <div className="back-img"></div>
          <span className="region-title">중국</span>
        </div>
        <div className="inner page-3">
          <div className="back-img"></div>
          <span className="region-title">베트남</span>
        </div>
        <div className="inner page-4">
          <div className="back-img"></div>
          <span className="region-title">러시아</span>
        </div>
      </div>
      <div className="nav">
        <div className="nav-section section-1">
          Nav - {selectedDestinationInfo.name}(
          {selectedDestinationInfo.regionIso})
        </div>
        <div className="nav-section section-2"></div>
        <div className="nav-section section-3"></div>
        <div className="nav-section section-4">
          여행경보
          <TravelSaveLvl
            regionIso={selectedDestinationInfo.regionIso}
            regionName={selectedDestinationInfo.name}
          ></TravelSaveLvl>
        </div>
      </div>
    </div>
  );
}

export default App;
