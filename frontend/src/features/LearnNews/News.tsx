import React, { useMemo } from "react";
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
      utterance.lang = "ko-KR"; // 한국어 읽어
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
