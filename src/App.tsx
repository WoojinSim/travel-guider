import React, { useState, useRef, useEffect } from "react";
import "./css/App.css";
import "./css/TravelSafeLvl.css";
import "./css/MapModal.css";
// import OpenAI from "openai";
import TravelSaveLvl from "./component/TravelSafeLvl"; // 컴포넌트 파일 경로에 맞게 수정
import TravelInfo from "./component/TravelInfo"; // 컴포넌트 파일 경로에 맞게 수정

const App: React.FC = () => {
  const destinationList = [
    { iso: "JP", name: "일본", nCode: "JP294232" },
    { iso: "CN", name: "중국", nCode: "CN294211" },
    { iso: "VN", name: "베트남", nCode: "VN293921" },
    { iso: "RU", name: "러시아", nCode: "RU294459" },
  ];
  // FIXME: 따로 변수를 사용하지 않고 페이지 상으로 iso 코드랑 국가이름을 가져와야함 (가능하다면)
  const [selectedDestinationInfo, setSelectedDestinationInfo] = useState({
    name: destinationList[0].name,
    regionIso: destinationList[0].iso,
    regionNCode: destinationList[0].nCode,
  });

  const outerDivRef = useRef<HTMLDivElement>(null); // 최상단 컴포넌트 ref
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 현재 페이지
  const [pageHeight, setPageHeight] = useState<number>(window.innerHeight); // 윈도우 높이

  const pageUp = () => {
    const scrollTop: number = Math.round(outerDivRef.current?.scrollTop!); // 현재 스크롤 위쪽 끝부분 위치 좌표
    const amountOfChildPages: number = outerDivRef.current?.childElementCount!;
    for (var i: number = 0; i < amountOfChildPages - 1; i++) {
      if (scrollTop > pageHeight * i && scrollTop <= pageHeight * (i + 1)) {
        // 현재 위치한 페이지 파악
        outerDivRef.current?.scrollTo({
          top: pageHeight * i,
          left: 0,
          behavior: "smooth",
        });
        setCurrentIndex(i);
        setSelectedDestinationInfo({
          name: destinationList[i].name,
          regionIso: destinationList[i].iso,
          regionNCode: destinationList[i].nCode,
        });
        break;
      }
    }
  };

  const pageDown = () => {
    const scrollTop: number = Math.round(outerDivRef.current?.scrollTop!); // 현재 스크롤 위쪽 끝부분 위치 좌표
    const amountOfChildPages: number = outerDivRef.current?.childElementCount!;
    for (let i: number = 0; i < amountOfChildPages - 1; i++) {
      if (scrollTop >= pageHeight * i && scrollTop < pageHeight * (i + 1)) {
        // 현재 위치한 페이지 파악
        outerDivRef.current?.scrollTo({
          top: pageHeight * (i + 1),
          left: 0,
          behavior: "smooth",
        });
        setCurrentIndex(i + 1);
        setSelectedDestinationInfo({
          name: destinationList[i + 1].name,
          regionIso: destinationList[i + 1].iso,
          regionNCode: destinationList[i + 1].nCode,
        });
        break;
      }
    }
  };

  // 이벤트 핸들러
  useEffect(() => {
    // 휠 이벤트
    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const { deltaY } = e;
      if (deltaY > 0) {
        // 스크롤 내릴 때 (하단으로)
        pageDown();
      } else {
        // 스크롤 올릴 때 (상단으로)
        pageUp();
      }
    };

    // 키보드 이벤트
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        pageUp();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        pageDown();
      }
    };

    // 윈도우 resize
    const resizeWindow = () => {
      setPageHeight(window.innerHeight);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", resizeWindow);
    outerDivRef.current?.addEventListener("wheel", wheelHandler);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeWindow);
      outerDivRef.current?.removeEventListener("wheel", wheelHandler);
    };
  }, []);

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
        {
          // TODO: 네비게이션 기능 상의 후 컴포넌트 작성
        }
        <div className="nav-section section-1">{currentIndex} 페이지</div>

        <TravelInfo
          regionNCode={selectedDestinationInfo.regionNCode}
        ></TravelInfo>

        <div className="nav-section section-3"></div>

        <div className="nav-section section-3"></div>
        <TravelSaveLvl
          regionIso={selectedDestinationInfo.regionIso}
          regionName={selectedDestinationInfo.name}
        ></TravelSaveLvl>
      </div>
    </div>
  );
};

export default App;
