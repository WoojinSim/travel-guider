import React, { useEffect, useState, useRef } from "react";

const TypingSpan: React.FC = () => {
  const [resultText, setResultText] = useState<string>();

  const textList = [
    [
      "ㄸ",
      "또",
      "똑",
      "똑ㄸ",
      "똑또",
      "똑똑",
      "똑똑ㅎ",
      "똑똑하",
      "똑똑한",
      "똑똑한 ",
      "똑똑한 ㄱ",
      "똑똑한 기",
      "똑똑한 길",
      "똑똑한 길ㄹ",
      "똑똑한 길라",
      "똑똑한 길라ㅈ",
      "똑똑한 길라자",
      "똑똑한 길라잡",
      "똑똑한 길라잡ㅇ",
      "똑똑한 길라잡이",
    ],
    [
      "ㅊ",
      "치",
      "친",
      "친ㅈ",
      "친저",
      "친절",
      "친절ㅎ",
      "친절하",
      "친절한",
      "친절한 ",
      "친절한 ㄱ",
      "친절한 가",
      "친절한 가ㅇ",
      "친절한 가이",
      "친절한 가이ㄷ",
      "친절한 가이드",
    ],
    [
      "ㄲ",
      "꼬",
      "꼼",
      "꼼ㄲ",
      "꼼꼬",
      "꼼꼼",
      "꼼꼼ㅎ",
      "꼼꼼하",
      "꼼꼼한",
      "꼼꼼한 ",
      "꼼꼼한 ㅋ",
      "꼼꼼한 큐",
      "꼼꼼한 큐ㄹ",
      "꼼꼼한 큐레",
      "꼼꼼한 큐레ㅇ",
      "꼼꼼한 큐레이",
      "꼼꼼한 큐레이ㅌ",
      "꼼꼼한 큐레이터",
    ],
    [
      "ㄷ",
      "드",
      "든",
      "든ㄷ",
      "든드",
      "든든",
      "든든ㅎ",
      "든든하",
      "든든한",
      "든든한 ",
      "든든한 ㅊ",
      "든든한 치",
      "든든한 친",
      "든든한 친ㄱ",
      "든든한 친구",
    ],
  ];

  useEffect(() => {
    let currentIndex: number = 0;
    let currentToken: number = 0;
    let isPause = { current: false, count: 0 };
    let isDeletion = { current: false, count: 0 };
    let currentString: string;

    const intervalTimer = setInterval(() => {
      if (isDeletion.current) {
        // 글자 지울 때
        setResultText(currentString.substring(0, isDeletion.count));
        isDeletion.count -= 1;
        if (isDeletion.count < 0) {
          isDeletion = { current: false, count: 0 };
        }
        return;
      }

      if (isPause.current) {
        // 잠깐 멈출 때
        isPause.count -= 1;
        if (isPause.count < 1) {
          isPause = { current: false, count: 0 };
          isDeletion = {
            current: true,
            count:
              textList[currentIndex][textList[currentIndex].length - 1].length,
          };
        }
        return;
      }

      if (currentToken < textList[currentIndex].length) {
        // 글자 출력
        setResultText(textList[currentIndex][currentToken]);
        currentToken += 1;
      } else {
        currentString = textList[currentIndex][currentToken - 1];
        currentToken = 0;
        currentIndex += 1;
        isPause = { current: true, count: 40 };
        if (currentIndex >= textList.length) {
          // 한 사이클 다 돌면 초기화
          currentIndex = 0;
        }
      }
    }, 80);

    return () => {
      clearInterval(intervalTimer);
    };
  }, []);
  // TODO: 옵져버로 이 컴포넌트 안보일 때 동작 멈추게 해야함
  return <span className="main-title context">{resultText}</span>;
};

export default TypingSpan;
