import React from "react";
import YellowBox from "../../components/YellowBox";
import BlackText from "../../components/BlackText";
import YellowButton from "../../components/YellowButton";
import { useSimLearnNewsStore } from "./SimLearnNewsStore";
import { useEffect } from "react";
import SpeechBubble from "../../components/SpeechBubble";

import listenSummationNews from "../../assets/audio/47_여기서는_뉴스를_요약해서_매일_들려드릴_거예요.mp3";
import beforeOrNext from "../../assets/audio/87_이전_이나_다음_버튼을_누르면_다른_뉴스로_넘어가요.mp3"
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

    // 오디오 플레이 (component가 mount될때만)
    useEffect(() => {
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
  
      // unmount될때 다 초기화
      return () => {
        listenSummationNewsAudio.pause();
        listenSummationNewsAudio.currentTime = 0;
        beforeOrNextAudio.pause();
        beforeOrNextAudio.currentTime = 0;
        sayBeforeAudio.pause();
        sayBeforeAudio.currentTime = 0;
      };
    }, []);

  const currentNews = newsData[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center">
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
            {currentNews.keywords.map(([keyword1, keyword2], index) => (
              <span key={index} className="mb-2 mr-2 rounded bg-yellow-200 p-1">
                {keyword1}, {keyword2}
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

      <div className="mt-8 relative top-[60px] flex w-full justify-center">
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
