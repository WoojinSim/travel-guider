// TravelSafeLvl.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import MapModal from "./MapModal";

const TravelSafeLvl = (props) => {
  const [alarmInfo, setAlarmInfo] = useState({
    regionIso: "",
    regionName: "",
    alarm_lvl: 0,
    alarm_remark: "N/A",
    map_url: "",
  });
  const ssDataRaw = sessionStorage.getItem(props.regionIso); // API의 호출 횟수 줄이기위한 세션 스토리지 get
  const [isMapModalOpen, setIsMapModalOpen] = useState(false); // 지도 모달창 노출 여부 state
  const showMap = () => {
    // 지도 모달창 노출
    setIsMapModalOpen(true);
  };

  useEffect(() => {
    // API호출 횟수를 줄이기위해 세션스토리지에 regionIso 국가의 데이터가 있는지 확인
    if (ssDataRaw === null) {
      // 세션 스토리지에 해당 국가에 대한 정보가 없을 경우
      // API 호출을 통한 데이터 획득
      const fetchSafeLvl = async () => {
        if (props.regionIso === "none") {
          console.log(
            "TravelSafeLvl 컴포넌트에 regionIso props를 넘겨주지 않음"
          );
          return;
        }
        var url =
          "http://apis.data.go.kr/1262000/TravelAlarmService2/getTravelAlarmList2";
        var queryParams =
          "?" +
          encodeURIComponent("serviceKey") +
          "=" +
          process.env.REACT_APP_TRAVEL_SAFE_LVL_API_KEY;
        queryParams +=
          "&" +
          encodeURIComponent("returnType") +
          "=" +
          encodeURIComponent("JSON");
        queryParams +=
          "&" +
          encodeURIComponent("numOfRows") +
          "=" +
          encodeURIComponent("10");
        queryParams +=
          "&" +
          encodeURIComponent("cond[country_nm::EQ]") +
          "=" +
          encodeURIComponent(props.regionName);
        queryParams +=
          "&" +
          encodeURIComponent("cond[country_iso_alp2::EQ]") +
          "=" +
          encodeURIComponent(props.regionIso);
        queryParams +=
          "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
        console.log(url + queryParams);
        try {
          axios.get(url + queryParams).then((Response) => {
            const rawData = Response.data.data;
            if (rawData.length < 1) {
              setAlarmInfo({
                alarm_lvl: 0,
                alarm_remark: "데이터를 가져올 수 없음",
              });
              return;
            }

            // 데이터가 정상적으로 넘어왔을 경우
            // 세션 스토리지에 먼저 각 정보를 저장
            const tmpSSDataRaw = {
              regionName: props.regionName,
              alarm_lvl: rawData[0]?.alarm_lvl,
              alarm_remark: rawData[0]?.remark,
              map_url: rawData[0]?.dang_map_download_url,
            };
            sessionStorage.setItem(
              props.regionIso,
              JSON.stringify(tmpSSDataRaw)
            );

            // 스테이트 업데이트
            setAlarmInfo({
              regionIso: props.regionIso,
              regionName: props.regionName,
              alarm_lvl: rawData[0]?.alarm_lvl,
              alarm_remark: rawData[0]?.remark,
              map_url: rawData[0]?.dang_map_download_url,
            });
          });
        } catch (e) {
          console.error(e);
        }
      };
      fetchSafeLvl();
    } else {
      // 세션 스토리지에 해당 국가에 대한 정보가 있는 경우
      // 세션 스토리지에서 데이터를 바로 가져와 스테이트 업데이트
      const ssData = JSON.parse(ssDataRaw);
      setAlarmInfo({
        regionIso: props.regionIso,
        regionName: props.regionName,
        alarm_lvl: ssData.alarm_lvl,
        alarm_remark: ssData.alarm_remark,
        map_url: ssData.map_url,
      });
    }
  }, [props.regionIso, props.regionName, ssDataRaw]);

  let safeLvlText = null;
  switch (alarmInfo.alarm_lvl) {
    case 0:
      safeLvlText = "알수없음";
      break;
    case 1:
      safeLvlText = "1단계 여행유의";
      break;
    case 2:
      safeLvlText = "2단계 여행자제";
      break;
    case 3:
      safeLvlText = "3단계 출국권고";
      break;
    case 4:
      safeLvlText = "4단계 여행금지";
      break;
    default:
      safeLvlText = alarmInfo.alarm_lvl;
  }

  return (
    <div className="safe-lvl-container">
      <span className={"safe-lvl lvl-" + alarmInfo.alarm_lvl}>
        {safeLvlText}
      </span>
      <button className="safe-remark" onClick={showMap}>
        {alarmInfo.alarm_remark}
      </button>
      {isMapModalOpen && (
        <MapModal
          setIsMapModalOpen={setIsMapModalOpen}
          mapUrl={alarmInfo.map_url}
          regionName={props.regionName}
        />
      )}
    </div>
  );
};

export default TravelSafeLvl;
