// TravelSafeLvl.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const TravelSafeLvl = (props) => {
  const [alarmLvl, setAlarmLvl] = useState();
  const [alarmRemark, setAlarmRemark] = useState();

  useEffect(() => {
    const fetchSafeLvl = async () => {
      if (props.regionIso == "none") {
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
        "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10");
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
            setAlarmLvl("데이터를 가져올 수 없음");
            return;
          }
          setAlarmLvl(rawData[0]?.alarm_lvl);
          setAlarmRemark(rawData[0]?.remark);
        });
      } catch (e) {
        console.log(e);
      }
    };
    fetchSafeLvl();
  });
  console.log(alarmRemark);
  let rusultSafeLvlText = null;
  switch (alarmLvl) {
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
