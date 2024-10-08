import React from "react";
import YellowBox from "../../components/YellowBox";
import BlackText from "../../components/BlackText";
import YellowButton from "../../components/YellowButton";
import { useLearnNewsStore } from "./useLearnNewsStore";
import { useEffect } from "react";

const News: React.FC = () => {
  const {
    newsData,
    currentIndex,
    isLoading,
    error,
    handlePrevious,
    handleNext,
  } = useLearnNewsStore();

  const currentNews = newsData[currentIndex];

  // 오늘의 뉴스 다 읽을 때까지 다음 페이지 자동으로 넘어가면서 다 읽어줌
  useEffect(() => {
    if (currentNews) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance();
  
      // tts로 읽을거 : title이랑 summary
      const speechText = `${currentNews.title}. ${currentNews.summary}`;
      utterance.text = speechText;
      utterance.lang = "ko-KR";  // 한국어 읽어
      utterance.rate = 1;
  
      // When the speech ends, move to the next page
      utterance.onend = () => {
        handleNext();
      };
  
      // component가 mount되면 시작해
      synth.speak(utterance);
  
      // unmount되면 말하는거 멈춰
      return () => {
        synth.cancel(); 
      };
    }
  }, [currentNews, handleNext]);
  

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
              <span
                key={index}
                className="mb-2 mr-2 rounded bg-yellow-200 p-1"
              >
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
    </div>
  );
};

export default News;