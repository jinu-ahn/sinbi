import React, { useMemo } from "react";
import YellowBox from "../../components/YellowBox";
import BlackText from "../../components/BlackText";
import YellowButton from "../../components/YellowButton";
import { useSimLearnNewsStore } from "./SimLearnNewsStore";
import { useEffect } from "react";
import SpeechBubble from "../../components/SpeechBubble";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

import listenSummationNews from "../../assets/audio/47_여기서는_뉴스를_요약해서_매일_들려드릴_거예요.mp3";
import beforeOrNext from "../../assets/audio/87_이전_이나_다음_버튼을_누르면_다른_뉴스로_넘어가요.mp3";
import sayBefore from "../../assets/audio/86_이전_이라고_말해주세요.mp3";

const SimNews: React.FC = () => {
  const {
    newsData,
    currentIndex,
    isLoading,
    error,
    handlePrevious,
    handleNext,
  } = useSimLearnNewsStore();

  const text = '뉴스를 요약해\n들려드려요.\n"이전"이라고\n말해주세요.';
  const boldChars = ["뉴스", "요약", "이전", "말"];
  const { setIsAudioPlaying } = useAudioSTTControlStore();

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    const listenSummationNewsAudio = new Audio(listenSummationNews);
    const beforeOrNextAudio = new Audio(beforeOrNext);
    const sayBeforeAudio = new Audio(sayBefore);

    // listenSummationNewsAudio 먼저 플레이
    listenSummationNewsAudio.play();

    // listenSummationNewsAudio 다음에 beforeOrNextAudio
    listenSummationNewsAudio.addEventListener("ended", () => {
      beforeOrNextAudio.play();
    });

    // beforeOrNextAudio 다음에 sayBeforeAudio
    beforeOrNextAudio.addEventListener("ended", () => {
      sayBeforeAudio.play();
    });

    sayBeforeAudio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
    })

    // unmount될때 다 초기화
    return () => {
      setIsAudioPlaying(true)
      listenSummationNewsAudio.pause();
      listenSummationNewsAudio.currentTime = 0;
      beforeOrNextAudio.pause();
      beforeOrNextAudio.currentTime = 0;
      sayBeforeAudio.pause();
      sayBeforeAudio.currentTime = 0;
    };
  }, []);

  const currentNews = newsData[currentIndex];
  console.log("Current news keywords:", currentNews?.keywords);
  // 주석: 키워드에서 숫자를 제거하는 함수
  const cleanKeyword = (keyword: string): string => {
    // const keywordStr = keyword.toString();
    // return keywordStr.replace(/\d+(\.\d+)?$/, '').trim();
    return keyword.trim();
  };
  // 주석: 중복 제거된 키워드 배열을 생성
  const uniqueKeywords = useMemo(() => {
    if (!currentNews) return [];

    const keywordSet = new Set(
      currentNews.keywords[0].map((keywordPair) =>
        cleanKeyword(keywordPair[0]),
      ),
    );
    return Array.from(keywordSet);
  }, [currentNews]);

  return (
    <div className="z-10 flex flex-col items-center justify-center">
      <BlackText text="오늘의 금융 소식" boldChars={["금융"]} />
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : currentNews ? (
        <YellowBox>
          <BlackText
            text={currentNews.title}
            boldChars={[]}
            textSize="text-2xl"
          />
          <BlackText
            text={currentNews.summary}
            boldChars={[]}
            textSize="text-lg"
          />
          <div className="mt-4 flex flex-wrap">
            {uniqueKeywords.map((keywordPair, index) => (
              <span key={index} className="mb-2 mr-2 rounded bg-yellow-200 p-1">
                {/* '0'을 기준으로 분할하여 앞부분만 사용  */}
                {/* {keyword1.split('0')[0]},  */}
                {/* {keyword2.split('0')[0]}  */}
                {/* {cleanKeyword(keywordPair)} */}
                {keywordPair}
                {/* {cleanKeyword(keyword2)} */}
              </span>
            ))}
          </div>
        </YellowBox>
      ) : (
        <div>No news available</div>
      )}
      <div className="z-10 mt-4 flex w-4/5 justify-between">
        <YellowButton height={50} width={100} onClick={handlePrevious}>
          이전
        </YellowButton>
        <YellowButton height={50} width={100} onClick={handleNext}>
          다음
        </YellowButton>
      </div>

      <div className="relative top-[-350px] z-20 mt-8 flex w-full justify-center">
        <SpeechBubble text={text} boldChars={boldChars} />
      </div>
      {/* <YellowButton
        height={50}
        width={100}
        onClick={() => setCurrentView("choice")}
      >
        뒤로
      </YellowButton> */}
    </div>
  );
};

export default SimNews;
