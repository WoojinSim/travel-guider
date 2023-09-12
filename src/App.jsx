//import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  organization: `${process.env.REACT_APP_OPENAI_ORG}`,
  apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`,
  dangerouslyAllowBrowser: true
});


const Resultable = (props) => {
  const [alarmLvl, setAlarmLvl] = useState();
  useEffect(() => {
    const fetchSafeLvl = async () => {
      if (props.iso == "none") {
        setAlarmLvl("국가선택"); return;
      }
      var url = "http://apis.data.go.kr/1262000/TravelAlarmService2/getTravelAlarmList2";
      var queryParams = "?" + encodeURIComponent("serviceKey") + "=" + process.env.REACT_APP_TRAVEL_SAFE_LVL_API_KEY;
      queryParams += "&" + encodeURIComponent("returnType") + "=" + encodeURIComponent("JSON");
      queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10");
      queryParams += "&" + encodeURIComponent("cond[country_nm::EQ]") + "=" + encodeURIComponent(props.regionName);
      queryParams += "&" + encodeURIComponent("cond[country_iso_alp2::EQ]") + "=" + encodeURIComponent(props.iso);
      queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
      console.log(url + queryParams)
      try {
        axios.get(url + queryParams).then((Response) => {
          const rawData = Response.data.data;
          if (rawData.length < 1) {setAlarmLvl("데이터를 가져올 수 없음"); return;}
          setAlarmLvl(rawData[0].alarm_lvl);          
        });
      } catch {
        console.log("에러")
      }
    }
    fetchSafeLvl();
  });

  let resultComp = null;
  console.log(alarmLvl)
  switch(alarmLvl) {
    case(1):
      resultComp = <span className={"lvl-" + alarmLvl}>1단계 여행유의</span>; break;
    case(2):
      resultComp = <span className={"lvl-" + alarmLvl}>2단계 여행자제</span>; break;
    case(3):
      resultComp = <span className={"lvl-" + alarmLvl}>3단계 출국권고</span>; break;
    case(4):
      resultComp = <span className={"lvl-" + alarmLvl}>4단계 여행금지</span>; break;
    default:
      resultComp = alarmLvl;
  }

  return(
    <table className="result-table">
      <tbody>
        <tr>
          <td className="table-header">선택한 여행지</td>
          <td>{props.regionName}({props.iso})</td>
        </tr>
        <tr>
          <td className="table-header">여행위험도</td>
          <td className="safe-lvl">{resultComp}</td>
        </tr>
      </tbody>
    </table>
  );
};

function App() {
  const [selectedDestinationInfo, setSelectedDestinationInfo] = useState(["none", null]); // 여행지정보 State [국가명, 국가ISO코드]
  const [destName, setDestName] = useState();
  //const [alarmLvl, setAlarmLvl] = useState();
  const destinationList = [
    { value: "none", name: "여행지 선택" },
    { value: "JP", name: "일본" },
    { value: "CN", name: "중국" },
    { value: "VN", name: "베트남" },
    { value: "RU", name: "러시아" }
  ];

  /*
  const [text, setText] = useState(''); // 요약할 텍스트
  const [summary, setSummary] = useState(''); // 요약 결과

  const summarizeText = async () => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "user", "content": `기사의 본문을 분석하고 2개의 해쉬태그로 요약해줘야해:\n\n${text}`}
          ],
      });
      setSummary(response.choices[0].message.content)
      alert(response.choices[0].message.content)
    } catch (error) {
      console.log(error)
    }
  }
  */

  const changeDestination = async (e) => {
    setSelectedDestinationInfo([
      e.target.value,
      e.target.options[e.target.selectedIndex].text
    ]);
  }

  return (
    <div className="App">
        <div className="rootBackground">
            <div className="outer-container">
              <div className="outer-title">여행가이드</div>
              <select className="combo-box" id="destination-select" onChange={changeDestination} value={selectedDestinationInfo[0]}>
                {destinationList.map((item) => (
                  <option value={item.value} key={item.name}>{item.name}</option>
                ))}
              </select>

              <Resultable iso={selectedDestinationInfo[0]} regionName={selectedDestinationInfo[1]}></Resultable>
              {/*
              <div className="inner-element">
                <span className="element-title"></span>
                <textarea value={text} onChange={(e) => setText(e.target.value)}>
                  테스트
                </textarea>
                <button onClick={summarizeText}>요약</button>
              </div>
              */}
            </div>
        </div>
    </div>
  );
}

export default App;
