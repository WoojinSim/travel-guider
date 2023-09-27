import React, { useEffect, useState } from "react";

const TypingSpan: React.FC = () => {
  const [resultText, setResultText] = useState<string>();
  const [isActive, setIsActive] = useState<string>("active");

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
      "ㅇ",
      "여",
      "열",
      "열ㅈ",
      "열저",
      "열정",
      "열정ㅈ",
      "열정저",
      "열정적",
      "열정적ㅇ",
      "열정적이",
      "열정적인",
      "열정적인 ",
      "열정적인 ㅈ",
      "열정적인 저",
      "열정적인 전",
      "열정적인 전ㅁ",
      "열정적인 전무",
      "열정적인 전문",
      "열정적인 전문ㄱ",
      "열정적인 전문가",
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
    [
      "ㄱ",
      "가",
      "감",
      "감ㄱ",
      "감가",
      "감각",
      "감각ㅈ",
      "감각저",
      "감각적",
      "감각적ㅇ",
      "감각적이",
      "감각적인",
      "감각적인 ",
      "감각적인 ㄷ",
      "감각적인 도",
      "감각적인 동",
      "감각적인 동ㅂ",
      "감각적인 동바",
      "감각적인 동반",
      "감각적인 동반ㅈ",
      "감각적인 동반자",
    ],
    [
      '"',
      '"ㄹ',
      '"로',
      '"로ㅋ',
      '"로커',
      '"로컬',
      '"로컬ㅁ',
      '"로컬마',
      '"로컬마ㅅ',
      '"로컬마스',
      '"로컬마스ㅌ',
      '"로컬마스터',
      '"로컬마스터"',
    ],
  ];

  useEffect(() => {
    let currentIndex: number = 0; // 글귀 인덱스 (다음 글귀 전환)
    let currentToken: number = 0; // 글자 인덱스 (타이핑 효과 구현)
    let isPause = { current: false, count: 0 }; // 타이핑 멈출 때
    let isDeletion = { current: false, count: 0 }; // 타이핑 지울 때
    let currentString: string; // 현재 글귀의 완성본

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
            count: textList[currentIndex][textList[currentIndex].length - 1].length,
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
        isPause = { current: true, count: 30 };
        if (currentIndex >= textList.length) {
          // 한 사이클 다 돌면 초기화
          currentIndex = 0;
          setIsActive("");
          clearInterval(intervalTimer);
          return;
        }
      }
    }, 80);

    return () => {
      clearInterval(intervalTimer);
    };
  }, []);
  // TODO: 옵져버로 이 컴포넌트 안보일 때 동작 멈추게 해야함
  return <span className={`main-title context ${isActive}`}>{resultText}</span>;
};

export default TypingSpan;
