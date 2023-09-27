import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./css/App.css";
import "./css/TypingSpan.css";
import "./css/WorldMap.css";
import "./css/RegionCard.css";
import "./css/RegionInfoMadal.css";

import TypingSpan from "./component/TypingSpan";
import WorldMap from "./component/WorldMap";
import RegionCard from "./component/RegionCard";
import RegionInfoModal from "./component/RegionInfoModal";

const App: React.FC = () => {
  const outerDivRef = useRef<HTMLDivElement>(null); // 최상단 컴포넌트 ref
  const [pageHeight, setPageHeight] = useState<number>(window.innerHeight); // 윈도우 높이
  const [regionInfo, setRegionInfo] = useState<Object | String | undefined>(); // 선택한 국가에 대한 API에서 가져온 정보

  const pageUp = () => {
    const scrollTop: number = Math.round(outerDivRef.current?.scrollTop!); // 현재 스크롤 위쪽 끝부분 위치 좌표
    const amountOfChildPages: number = outerDivRef.current?.childElementCount!;
    for (var i: number = 0; i < amountOfChildPages - 1; i++) {
      if (scrollTop > pageHeight * i && scrollTop <= pageHeight * (i + 1)) {
        // 현재 위치한 페이지 파악
        outerDivRef.current?.scrollTo({ top: pageHeight * i, left: 0, behavior: "smooth" });
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
        outerDivRef.current?.scrollTo({ top: pageHeight * (i + 1), left: 0, behavior: "smooth" });
        break;
      }
    }
  };

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

  const enableEvent = (state: boolean) => {
    if (state) {
      window.addEventListener("keydown", handleKeyDown);
      outerDivRef.current?.addEventListener("wheel", wheelHandler);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      outerDivRef.current?.removeEventListener("wheel", wheelHandler);
    }
  };

  // 이벤트 핸들러
  useEffect(() => {
    // 윈도우 resize
    const resizeWindow = () => {
      setPageHeight(window.innerHeight);
    };
    enableEvent(true);
    outerDivRef.current?.addEventListener("wheel", wheelHandler);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeWindow);
      outerDivRef.current?.removeEventListener("wheel", wheelHandler);
    };
  }, []);

  // FIXME: 되도록 컴포넌드 압축할 것. 제발...
  return (
    <BrowserRouter>
      <div className="App">
        <div className="outer-base" ref={outerDivRef}>
          <div className="inner page-1">
            <div className="back-video-wrap">
              <div className="back-video-filter"></div>
              <video muted autoPlay loop className="back-video">
                <source src={require("./img/travel.mp4")} type="video/mp4" />
              </video>
            </div>
            <div className="main-title-wrap">
              <div className="school-title">데이터베이스프로그래밍 2팀</div>
              <span className="main-title top">당신이 여행하는 모든곳의</span>
              <TypingSpan></TypingSpan>
              <span className="main-title bottom">
                입니다<b>.</b>
              </span>
              <ul className="author-list">
                <li className="author-list-wrap">
                  <div className="author-card">
                    <section className="card-title">
                      <span className="card-name">정민경</span>
                      <span className="card-id">202101800</span>
                    </section>
                    <ul className="card-dolist">
                      <li>데이터수집(크롤링) 백엔드 개발</li>
                      <li>DB 및 자료 전처리 알고리즘 개발</li>
                      <li>DB 통신 엔드포인트 API개발</li>
                    </ul>
                  </div>
                </li>
                <li className="author-list-wrap">
                  <div className="author-card">
                    <section className="card-title">
                      <span className="card-name">정미리</span>
                      <span className="card-id">202202219</span>
                    </section>
                    <ul className="card-dolist">
                      <li>웹 UX/UI 디자인</li>
                      <li>웹 레이아웃 및 인터페이스 디자인</li>
                      <li>데이터 전처리 알고리즘 디자인</li>
                    </ul>
                  </div>
                </li>
                <li className="author-list-wrap">
                  <div className="author-card">
                    <section className="card-title">
                      <span className="card-name">심우진</span>
                      <span className="card-id">201905161</span>
                    </section>
                    <ul className="card-dolist">
                      <li>React 프론트엔드 개발</li>
                      <li>데이터수집(크롤링) 백엔드 개발</li>
                      <li>백엔드 통신 엔드포인트 API개발</li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="inner page-2">
            <WorldMap scrollRef={outerDivRef} pageHeight={pageHeight}></WorldMap>
            <span className="map-caption">여행지를 선택해주세요</span>
          </div>
          <div className="inner page-3">
            <Routes>
              <Route path="/" element={<></>}></Route>
              <Route
                path="/info/:regionISO"
                element={<RegionInfoModal regionInfo={regionInfo} enableEvent={enableEvent} />}
              ></Route>
              <Route path="*" element={<RegionInfoModal />}></Route>
            </Routes>

            <RegionCard regionIso="JP" setRegionInfo={setRegionInfo} enableEvent={enableEvent}></RegionCard>
            <RegionCard regionIso="CN" setRegionInfo={setRegionInfo} enableEvent={enableEvent}></RegionCard>
            <RegionCard regionIso="VN" setRegionInfo={setRegionInfo} enableEvent={enableEvent}></RegionCard>
            <RegionCard regionIso="US" setRegionInfo={setRegionInfo} enableEvent={enableEvent}></RegionCard>
            <RegionCard regionIso="UK" setRegionInfo={setRegionInfo} enableEvent={enableEvent}></RegionCard>
            <RegionCard regionIso="RU" setRegionInfo={setRegionInfo} enableEvent={enableEvent}></RegionCard>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
