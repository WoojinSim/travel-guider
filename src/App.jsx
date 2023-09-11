//import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import OpenAI from "openai";

const openai = new OpenAI({
  organization: `${process.env.OPENAI_APP_ORG}`,
  apiKey: `${process.env.OPENAI_APP_API_KEY}`,
  dangerouslyAllowBrowser: true
});

const Resultdest = (props) => {
  return(
    <span>현재 환율</span>
  );
};

function App() {
  const [selectedDest, setSelectedDest] = useState("none");
  const destinationList = [
    { value: "none", name: "여행지 선택" },
    { value: "JP", name: "일본" },
    { value: "US", name: "미국" },
    { value: "CN", name: "중국" }
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
    setSelectedDest(e.target.value)
    console.log(e.target.value)
  }

  return (
    <div className="App">
        <div className="rootBackground">
            <div className="outer-container">
              <div className="outer-title">여행가이드</div>
              <select className="combo-box" id="destination-select" onChange={changeDestination} value={selectedDest}>
                {destinationList.map((item) => (
                  <option value={item.value} key={item.name}>{item.name}</option>
                ))}
              </select>
              <Resultdest option={selectedDest}></Resultdest>
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
