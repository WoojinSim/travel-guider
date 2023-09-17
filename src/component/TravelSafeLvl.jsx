// TravelSafeLvl.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const TravelSafeLvl = (props) => {
  const [alarmLvl, setAlarmLvl] = useState(); // 여행경보 레벨
  const [alarmRemark, setAlarmRemark] = useState(); // 여행경보 레벨 설정 사유 및 범위
  const ssDataRaw = sessionStorage.getItem(props.regionIso); // API의 호출 횟수 줄이기위한 세션 스토리지 get

  useEffect(() => {
    if (ssDataRaw === null) {
      // 세션 스토리지에 해당 국가에 대한 정보가 없을 경우
      // API 호출을 통한 데이터 획득
      const fetchSafeLvl = async () => {
        if (props.regionIso === "none") {
          setAlarmLvl("국가선택");
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
        // console.log(url + queryParams);
        try {
          axios.get(url + queryParams).then((Response) => {
            const rawData = Response.data.data;
            if (rawData.length < 1) {
              setAlarmLvl(0);
              setAlarmRemark("데이터를 가져올 수 없음");
              return;
            }
            const tmpSSDataRaw = {
              regionName: props.regionName,
              alarm_lvl: rawData[0]?.alarm_lvl,
              alarm_remark: rawData[0]?.remark,
            };
            const tmpSSDataJson = JSON.stringify(tmpSSDataRaw);
            sessionStorage.setItem(props.regionIso, tmpSSDataJson);
            setAlarmLvl(rawData[0]?.alarm_lvl);
            setAlarmRemark(rawData[0]?.remark);
          });
        } catch (e) {
          console.error(e);
        }
      };
      fetchSafeLvl();
    } else {
      // 세션 스토리지에 해당 국가에 대한 정보가 있는 경우
      const ssData = JSON.parse(ssDataRaw);
      setAlarmLvl(ssData.alarm_lvl);
      setAlarmRemark(ssData.alarm_remark);
    }
  });

  let rusultSafeLvlText = null;
  switch (alarmLvl) {
    case 0:
      rusultSafeLvlText = "알수없음";
      break;
    case 1:
      rusultSafeLvlText = "1단계 여행유의";
      break;
    case 2:
      rusultSafeLvlText = "2단계 여행자제";
      break;
    case 3:
      rusultSafeLvlText = "3단계 출국권고";
      break;
    case 4:
      rusultSafeLvlText = "4단계 여행금지";
      break;
    default:
      rusultSafeLvlText = alarmLvl;
  }

  return (
    <div className="safe-lvl">
      <span className={"lvl-" + alarmLvl}>{rusultSafeLvlText}</span>
      <a className="safe-remark">{alarmRemark}</a>
    </div>
  );
};

export default TravelSafeLvl;
