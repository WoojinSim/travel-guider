// RegionInfoModal.jsx
import { useParams, Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useNaverDataQuery, useExchangeDataQuery } from "../module/infoApi";
import { useAuth } from "../context/AuthContext";

interface RegionInfoModalProps {
  enableEvent?: (state: boolean) => void;
}
interface exchangeData {
  region: string;
  label: string;
}
interface newsData {
  title: string;
  content: string;
  date: string;
  link: string;
}

// FIXME: 국가별 데이터 통합 필요
const destinationList = new Map();
destinationList.set("JP", { name: "일본", nCode: "JP294232", exIndex: 12 });
destinationList.set("CN", { name: "중국", nCode: "CN294211", exIndex: 6 });
destinationList.set("VN", { name: "베트남", nCode: "VN293921", exIndex: -1 });
destinationList.set("RU", { name: "러시아", nCode: "RU294459", exIndex: -2 });
destinationList.set("US", { name: "미국", nCode: "US191", exIndex: 22 });
destinationList.set("UK", { name: "영국", nCode: "GB186216", exIndex: 9 });
destinationList.set("FR", { name: "프랑스", nCode: "FR187070", exIndex: 8 });
destinationList.set("SG", { name: "싱가포르", nCode: "SG294262", exIndex: 20 });
destinationList.set("TH", { name: "태국", nCode: "TH293915", exIndex: 21 });
destinationList.set("PH", { name: "필리핀", nCode: "PH294245", exIndex: -3 });

const RegionInfoModal: React.FC<RegionInfoModalProps> = (props) => {
  const { regionISO } = useParams(); // Router에서 가져온 파라메터 저장
  const {
    isLoggedIn,
    id,
    handleGetFavList,
    handleToggleFav,
    userFavList,
    handleGetTravelNews,
    handleGetGeneralNews,
    handleGetCrimeRata,
  } = useAuth();
  const movePage = useNavigate();
  // const weatherRecommend = regionInfo?.weatherRecommend.season; // 여행 추천날짜 (임시)

  const outerDivRef = useRef<HTMLDivElement>(null); // 최상단 컴포넌트 ref
  const exitBtnRef = useRef(null); // 최상단 컴포넌트 ref
  const destinationInfo = destinationList.get(regionISO);

  const [compHeight, setCompHeight] = useState<number>(outerDivRef.current?.offsetHeight ?? 0); // 컴포넌트 높이
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [staredStatus, setStaredStatus] = useState<string>("");
  const [travelNewsList, setTravelNewsList] = useState<newsData[]>([]);
  const [generalNewsList, setGeneralNewsList] = useState<newsData[]>([]);
  const [exchangeLabel, setExchangeLabel] = useState<exchangeData>({ region: "", label: "" });
  const [travelNewsElements, setTravelNewsElements] = useState<React.ReactElement[]>([]);
  const [generalNewsElements, setGeneralNewsElements] = useState<React.ReactElement[]>([]);
  const [crimeRate, setCrimeRate] = useState<string>("오류ㄴ");

  const pageDown = () => {
    const scrollTop: number = Math.round(outerDivRef.current?.scrollTop!); // 현재 스크롤 위쪽 끝부분 위치 좌표
    const amountOfChildPages: number = outerDivRef.current?.childElementCount!;
    for (let i: number = 0; i < amountOfChildPages - 1; i++) {
      if (scrollTop >= compHeight * i && scrollTop < compHeight * (i + 1)) {
        // 현재 위치한 페이지 파악
        setCurrentPage(i + 1);
        outerDivRef.current?.scrollTo({
          top: compHeight * (i + 1),
          left: 0,
          behavior: "smooth",
        });
        break;
      }
    }
  };

  const pageUp = () => {
    const scrollTop: number = Math.round(outerDivRef.current?.scrollTop!); // 현재 스크롤 위쪽 끝부분 위치 좌표
    const amountOfChildPages: number = outerDivRef.current?.childElementCount!;
    for (var i: number = 0; i < amountOfChildPages - 1; i++) {
      if (scrollTop > compHeight * i && scrollTop <= compHeight * (i + 1)) {
        // 현재 위치한 페이지 파악
        setCurrentPage(i);
        outerDivRef.current?.scrollTo({
          top: compHeight * i,
          left: 0,
          behavior: "smooth",
        });
        break;
      }
    }
  };

  const toggleStar = () => {
    if (isLoggedIn) {
      handleToggleFav(`${regionISO}`);
    } else {
      movePage("/LoginPage");
    }
  };

  const naverData = useNaverDataQuery(destinationInfo.nCode);
  const exchangeData = useExchangeDataQuery(destinationInfo.exIndex);
  const dataJson = naverData.data?.data;

  useEffect(() => {
    if (!isLoggedIn) {
      setStaredStatus("");
    } else {
      if (userFavList.includes(`${regionISO}`)) {
        setStaredStatus("stared");
      } else {
        setStaredStatus("");
      }
    }
  }, [userFavList]);

  // 이벤트 핸들러
  useEffect(() => {
    // 휠 이벤트
    const wheelHandler = (e: WheelEvent) => {
      // e.preventDefault();
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

    if (!isLoggedIn) {
      setStaredStatus("");
    } else {
      const loadFavData = async () => {
        const data = await handleGetFavList(id);
        if (data.includes(`${regionISO}`)) {
          setStaredStatus("stared");
        } else {
          setStaredStatus("");
        }
      };
      loadFavData();
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeWindow);
      outerDivRef.current?.removeEventListener("wheel", wheelHandler);
    };
  }, [compHeight]);

  useEffect(() => {
    const getTravelNews = async () => {
      setTravelNewsList(await handleGetTravelNews(`${regionISO}`));
    };

    const getGeneralNews = async () => {
      setGeneralNewsList(await handleGetGeneralNews(`${regionISO}`));
    };

    const getCrimeRate = async () => {
      setCrimeRate(await handleGetCrimeRata(`${regionISO}`));
    };

    getTravelNews();
    getGeneralNews();
    getCrimeRate();
  }, [regionISO]);

  useEffect(() => {
    const travelNewsElements = travelNewsList.map((news, index) => (
      <section className="travel-news-item" key={`travelNewsList-${index}`}>
        <a className="news-title" href={news.link} target="_blank" rel="noreferrer">
          <span className="news-title-label">{news.title}</span>
          <span className="news-title-content">{news.content}</span>
        </a>
      </section>
    ));
    setTravelNewsElements(travelNewsElements);
  }, [travelNewsList]);

  useEffect(() => {
    const generalNewsElements = generalNewsList.map((news, index) => (
      <section className="travel-news-item" key={`generalNewsList-${index}`}>
        <a className="news-title" href={news.link} target="_blank" rel="noreferrer">
          <span className="news-title-label">{news.title}</span>
          <span className="news-title-content">{news.content}</span>
        </a>
      </section>
    ));
    setGeneralNewsElements(generalNewsElements);
  }, [generalNewsList]);

  return (
    <div className="info-modal-wrap">
      <Link
        className="exit-btn"
        to={"/"}
        onClick={() => {
          props.enableEvent?.(true);
        }}
        ref={exitBtnRef}
      ></Link>

      <section className="inner-container" ref={outerDivRef}>
        {naverData.isLoading && (
          <>
            <span className="loader"></span>
            <span className="loader-text">정보를 로딩하는 중입니다.</span>
          </>
        )}
        {!naverData.isLoading && naverData.isError && (
          <>
            <div className="inner-block page-1">
              <span className="error-msg">데이터를 불러오는데 문제가 발생했습니다.</span>
            </div>
          </>
        )}
        {!naverData.isLoading && !naverData.isError && (
          <>
            <div className="inner-block page-1">
              <div className="region-back-video-wrap">
                <div className="region-back-video-filter"></div>
                <video muted autoPlay loop className="region-back-video">
                  <source src={require(`../img/region-videos/${regionISO}-vedio.mp4`)} type="video/mp4" />
                </video>
              </div>
              <div className="title-wrap">
                <span className="title-region-name">
                  {dataJson.nameKo} <b>|</b> {dataJson.nameEn}
                </span>
                <span className="title-region-lore">{dataJson.descriptionInfo.publisher}</span>
              </div>
            </div>
            <div className="inner-block page-2">{travelNewsElements}</div>
            <div className="inner-block page-3">{generalNewsElements}</div>
            <div className="inner-block page-4">
              <div className="info-item">
                <span className="info-title">시차</span>
                {dataJson?.timezoneDesc}
              </div>
              <div className="info-item">
                <span className="info-title">사용 언어</span>
                {dataJson?.language.langList.join(", ")}
              </div>
              <div className="info-item">
                <span className="info-title">전압</span>
                {dataJson?.plugInfo.description}
              </div>
              <div className="info-item">
                <span className="info-title">비자</span>
                {dataJson?.visaInfo.description}
              </div>
              <div className="info-item flight">
                <span className="info-title">항공</span>
                <span className="flight-title">경로</span>
                <span className="flight-label">
                  인천(ICN) → {dataJson?.flights[0].airportInfo.cityName}({dataJson?.flights[0].airportInfo.iataCode})
                </span>
                <span className="flight-title">소요시간</span>
                <span className="flight-label">
                  직항 {Math.floor(dataJson?.shortestFlightInfo.duration / 60)} 시간
                  {dataJson?.shortestFlightInfo.duration % 60}분
                </span>
                <span className="flight-title">최저가</span>
                <span className="flight-label">
                  <p>{dataJson?.flightsByPeriod.all.min.tripDays}일 일정</p> 약{" "}
                  {Math.floor(dataJson?.flightsByPeriod.all.min.fare / 10000)}
                  만원
                </span>
              </div>
              <div className="info-item">
                <span className="info-title">물가 | 팁문화</span>
                <span className="flight-title">물가</span>
                <span className="flight-label">
                  <p>{dataJson?.priceInfo.shortDescription}</p>,{dataJson?.priceInfo.fullDescription}
                </span>
                <span className="flight-title">팁문화</span>
                <span className="flight-label">
                  <p>{dataJson?.tipInfo.active ? "있음" : "없음"}</p>,{dataJson?.tipInfo.description}
                </span>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="sidebar">
        {!naverData.isLoading && !naverData.isError && (
          <>
            <div className="side-title">
              <span className={`region-stared-btn ${staredStatus}`} onClick={toggleStar}>
                ★
              </span>
              <div className="region-name-wrap">
                <span className="region-name-KR">{dataJson.nameKo}</span>
                <span className="region-name-EN">{dataJson.nameEn}</span>
              </div>
            </div>
            <div className="side-items-wrap">
              <div className="side-item">
                <span className="side-item-title item-1">입국</span>
                {dataJson?.entryInfo.entryAvailable}
              </div>
              <div className="side-item item-2">
                <span className="side-item-title">환율</span>
                <>
                  <span className="exchange-label">
                    {exchangeData.data?.bkpr} {exchangeData.data?.cur_unit}
                  </span>
                  <span className="exchange-unit">{exchangeData.data?.cur_nm}</span>
                </>
              </div>
              <div className="side-item item-3">
                <span className="side-item-title">날씨</span>
                <span className="side-weather">
                  {dataJson?.weatherInfo.monthly.minTem}°C ~ {dataJson?.weatherInfo.monthly.maxTem}°C
                </span>
              </div>
              <div className="side-item item-4">
                <span className="side-item-title">범죄율</span>
                {crimeRate}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default RegionInfoModal;
