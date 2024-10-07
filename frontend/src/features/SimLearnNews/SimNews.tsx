import React from "react";
import YellowBox from "../../components/YellowBox";
import BlackText from "../../components/BlackText";
import YellowButton from "../../components/YellowButton";
import { useSimLearnNewsStore } from "./SimLearnNewsStore";
import { useEffect } from "react";
import listenSummationNews from "../../assets/audio/47_여기서는_뉴스를_요약해서_매일_들려드릴_거예요.mp3";

const SimNews: React.FC = () => {
  const {
    newsData,
    currentIndex,
    isLoading,
    error,
    handlePrevious,
    handleNext,
    setCurrentView,
  } = useSimLearnNewsStore();

  // 오디오말하기
  const listenSummationNewsAudio = new Audio(listenSummationNews);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    // 플레이시켜
    listenSummationNewsAudio.play();

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!listenSummationNewsAudio.paused) {
        listenSummationNewsAudio.pause();
        listenSummationNewsAudio.currentTime = 0;
      }
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
      <div className="mt-4 flex w-4/5 justify-between">
        <YellowButton height={50} width={100} onClick={handlePrevious}>
          이전
        </YellowButton>
        <YellowButton height={50} width={100} onClick={handleNext}>
          다음
        </YellowButton>
      </div>
      <YellowButton
        height={50}
        width={100}
        onClick={() => setCurrentView("choice")}
      >
        뒤로
      </YellowButton>
    </div>
  );
};

export default SimNews;
