import React from "react";
import YellowBox from "../../components/YellowBox";
import BlackText from "../../components/BlackText";
import YellowButton from "../../components/YellowButton";
import { useLearnNewsStore } from "./useLearnNewsStore";

const News: React.FC = () => {
  const {
    newsData,
    currentIndex,
    isLoading,
    error,
    handlePrevious,
    handleNext,
    setCurrentView,
  } = useLearnNewsStore();

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

export default News;