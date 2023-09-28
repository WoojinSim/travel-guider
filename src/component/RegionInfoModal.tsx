// RegionInfoModal.jsx

import axios, { AxiosError } from "axios";
import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";

interface RegionInfoModalProps {
  enableEvent?: (state: boolean) => void;
}

const destinationList = new Map();
destinationList.set("JP", { name: "일본", nCode: "JP294232" });
destinationList.set("CN", { name: "중국", nCode: "CN294211" });
destinationList.set("VN", { name: "베트남", nCode: "VN293921" });
destinationList.set("RU", { name: "러시아", nCode: "RU294459" });
destinationList.set("US", { name: "미국", nCode: "US191" });
destinationList.set("UK", { name: "영국", nCode: "GB186216" });

const RegionInfoModal: React.FC<RegionInfoModalProps> = (props) => {
  const { regionISO } = useParams(); // Router에서 가져온 파라메터 저장
  // const weatherRecommend = regionInfo?.weatherRecommend.season; // 여행 추천날짜 (임시)

  const outerDivRef = useRef<HTMLDivElement>(null); // 최상단 컴포넌트 ref
  const exitBtnRef = useRef(null); // 최상단 컴포넌트 ref
  const [compHeight, setCompHeight] = useState<number>(outerDivRef.current?.offsetHeight ?? 0); // 컴포넌트 높이
  const destinationInfo = destinationList.get(regionISO);
  const [animationState, setAnimationState] = useState<string>("opening");

  const pageUp = () => {
    const scrollTop: number = Math.round(outerDivRef.current?.scrollTop!); // 현재 스크롤 위쪽 끝부분 위치 좌표
    const amountOfChildPages: number = outerDivRef.current?.childElementCount!;
    for (var i: number = 0; i < amountOfChildPages - 1; i++) {
      if (scrollTop > compHeight * i && scrollTop <= compHeight * (i + 1)) {
        // 현재 위치한 페이지 파악
        outerDivRef.current?.scrollTo({
          top: compHeight * i,
          left: 0,
          behavior: "smooth",
        });
        break;
      }
    }
  };

  const pageDown = () => {
    const scrollTop: number = Math.round(outerDivRef.current?.scrollTop!); // 현재 스크롤 위쪽 끝부분 위치 좌표
    const amountOfChildPages: number = outerDivRef.current?.childElementCount!;
    for (let i: number = 0; i < amountOfChildPages - 1; i++) {
      if (scrollTop >= compHeight * i && scrollTop < compHeight * (i + 1)) {
        // 현재 위치한 페이지 파악
        outerDivRef.current?.scrollTo({
          top: compHeight * (i + 1),
          left: 0,
          behavior: "smooth",
        });
        break;
      }
    }
  };

  const { data, isLoading, isError, error } = useQuery(
    destinationInfo.nCode,
    async () => {
      const { data } = await axios.get(`http://localhost:4000/API/${destinationInfo.nCode}`);
      return data;
    },
    {
      onSuccess: (response) => {
        console.log(response);
      },
      onError: (error: AxiosError) => {
        console.log(error.code);
      },
      staleTime: 60000, // 10분
    }
  );

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
      setCompHeight(outerDivRef.current?.offsetHeight ?? 0);
    };

    setCompHeight(outerDivRef.current?.offsetHeight!);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", resizeWindow);
    outerDivRef.current?.addEventListener("wheel", wheelHandler);
    props.enableEvent?.(false);

    setTimeout(() => {
      setAnimationState("");
    }, 500);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeWindow);
      outerDivRef.current?.removeEventListener("wheel", wheelHandler);
    };
  }, [compHeight]);

  return (
    <div className={`info-modal-wrap ${animationState}`}>
      <div className="back-board"></div>
      <Link
        className="exit-btn"
        to={"/"}
        onClick={() => {
          props.enableEvent?.(true);
        }}
        ref={exitBtnRef}
      ></Link>
      {isLoading && (
        <div className="inner-container" ref={outerDivRef}>
          <span className="loader"></span>
          <span className="loader-text">정보를 로딩하는 중입니다.</span>
        </div>
      )}
      {!isLoading && isError && (
        <div className="inner-container" ref={outerDivRef}>
          <div className="inner-block page-1">
            <span className="error-msg">데이터를 불러오는데 문제가 발생했습니다.</span>
            <span className="error-code">({error.code})</span>
          </div>
        </div>
      )}
      {!isLoading && !isError && (
        <div className="inner-container" ref={outerDivRef}>
          <div className="inner-block page-1">
            <div className="title-wrap">
              <span className="title-region-name">
                {data?.nameKo} <b>|</b> {data?.nameEn}
              </span>
              <span className="title-region-lore">{data?.descriptionInfo.publisher}</span>
            </div>
          </div>
          <div className="inner-block page-2">2페이지</div>
          <div className="inner-block page-3">3페이지</div>
        </div>
      )}
    </div>
  );
};

/*
<div className="inner-title">
  {regionInfo?.nameKo} <b>|</b> {regionInfo?.nameEn} <b>|</b>{" "}
  {regionInfo?.naverId}
</div>
  <div className="inner-comp-wrap">
  <table className="inner-list">
    <tbody>
      <tr>
        <td className="table-title">입국가능여부</td>
        <td colSpan={2}>{regionInfo?.entryInfo.entryAvailable}</td>
      </tr>
      <tr>
        <td className="table-title">백신접종여부</td>
        <td colSpan={2}>{regionInfo?.entryInfo.isVaccinate}</td>
      </tr>
      <tr>
        <td className="table-title">여행자격리여부</td>
        <td colSpan={2}>{regionInfo?.entryInfo.needSeparated}</td>
      </tr>
      <tr>
        <td className="table-title">시차</td>
        <td colSpan={2}>{regionInfo?.timezoneDesc}</td>
      </tr>
      <tr>
        <td className="table-title">물가</td>
        <td colSpan={2}>
          한국 대비 {regionInfo?.priceInfo.shortDescription}
        </td>
      </tr>
      <tr>
        <td className="table-title" rowSpan={2}>
          사용언어
        </td>
        <td colSpan={2}>{regionInfo?.language.langList[0]}</td>
      </tr>
      <tr>
        <td colSpan={2}>{regionInfo?.language.useEnglish}</td>
      </tr>
      <tr>
        <td className="table-title">날씨</td>
        <td colSpan={2}>
          {regionInfo?.weatherInfo.month}{" "}
          {regionInfo?.weatherInfo.monthly.minTem}°C ~{" "}
          {regionInfo?.weatherInfo.monthly.maxTem}°C
        </td>
      </tr>
      <tr>
        <td className="table-title">추천여행일자</td>
        <td colSpan={2}>{regionInfo?.weatherRecommend.season[0]}</td>
      </tr>
      <tr>
        <td className="table-title">전압</td>
        <td colSpan={2}>{regionInfo?.plugInfo.description}</td>
      </tr>
      <tr>
        <td className="table-title">비자</td>
        <td>{regionInfo?.visaInfo.description}</td>
      </tr>
      <tr>
        <td className="table-title" rowSpan={3}>
          항공
        </td>
        <td className="table-title">경로</td>
        <td>
          인천(ICN) → {regionInfo?.flights[0].airportInfo.cityName}(
          {regionInfo?.flights[0].airportInfo.iataCode})
        </td>
      </tr>
      <tr>
        <td className="table-title">소요시간</td>
        <td>
          직항{" "}
          {Math.floor(regionInfo?.shortestFlightInfo.duration / 60)}
          시간 {regionInfo?.shortestFlightInfo.duration % 60}분
        </td>
      </tr>
      <tr>
        <td className="table-title">최저가</td>
        <td>
          <p>{regionInfo?.flightsByPeriod.all.min.tripDays}일 일정</p>{" "}
          약{" "}
          {Math.floor(regionInfo?.flightsByPeriod.all.min.fare / 10000)}
          만원
        </td>
      </tr>
      <tr>
        <td className="table-title" rowSpan={5}>
          호텔 최저가
        </td>
        <td className="table-title">1성급</td>
        <td>
          약{" "}
          {Math.floor(regionInfo?.hotel.avgRates[0]?.avgRate / 10000)}만{" "}
          {Math.floor(
            (regionInfo?.hotel.avgRates[0]?.avgRate % 10000) / 1000
          )}
          천원
        </td>
      </tr>
      <tr>
        <td className="table-title">2성급</td>
        <td>
          약{" "}
          {Math.floor(regionInfo?.hotel.avgRates[1]?.avgRate / 10000)}만{" "}
          {Math.floor(
            (regionInfo?.hotel.avgRates[1]?.avgRate % 10000) / 1000
          )}
          천원
        </td>
      </tr>
      <tr>
        <td className="table-title">3성급</td>
        <td>
          약{" "}
          {Math.floor(regionInfo?.hotel.avgRates[2]?.avgRate / 10000)}만{" "}
          {Math.floor(
            (regionInfo?.hotel.avgRates[2]?.avgRate % 10000) / 1000
          )}
          천원
        </td>
      </tr>
      <tr>
        <td className="table-title">4성급</td>
        <td>
          약{" "}
          {Math.floor(regionInfo?.hotel.avgRates[3]?.avgRate / 10000)}만{" "}
          {Math.floor(
            (regionInfo?.hotel.avgRates[3]?.avgRate % 10000) / 1000
          )}
          천원
        </td>
      </tr>
      <tr>
        <td className="table-title">5성급</td>
        <td>
          약{" "}
          {Math.floor(regionInfo?.hotel.avgRates[4]?.avgRate / 10000)}만{" "}
          {Math.floor(
            (regionInfo?.hotel.avgRates[4]?.avgRate % 10000) / 1000
          )}
          천원
        </td>
      </tr>
    </tbody>
  </table>
  </div>
  */

export default RegionInfoModal;
