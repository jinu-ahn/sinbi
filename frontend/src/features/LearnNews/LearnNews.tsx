import React, { useEffect, useState } from "react";
import YellowBox from "../../components/YellowBox";
import BlackText from "../../components/BlackText";
import YellowButton from "../../components/YellowButton";
import { useLearnNewsStore } from "./useLearnNewsStore";
// import { NewsItem } from "./LearnNews.types";
import Avatar from "../../assets/avatar.png";
// 홈 아이콘 컴포넌트
const HomeIcon: React.FC = () => (
  <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-yellow-400">
    <div className="text-2xl font-bold">
      처음
      <br />
      으로
    </div>
  </div>
);

// 뉴스 데이터 새로고침 간격 (2시간)
const REFRESH_INTERVAL = 2 * 60 * 60 * 1000; 

const LearnNews: React.FC = () => {
  // const [currentView, setCurrentView] = useState<"main" | "learn" | "news">(
  // "main",
  // );
  const {
    newsData,
    currentIndex,
    currentView,
    isLoading,
    error,
    fetchNews,
    handlePrevious,
    handleNext,
    setCurrentView,
  } = useLearnNewsStore();

  // React.useEffect(() => {
  //   fetchNews();
  // }, [fetchNews]);
  useEffect(() => {
    fetchNews(); // 컴포넌트 마운트 시 뉴스 데이터 가져오기
    const intervalId = setInterval(fetchNews, REFRESH_INTERVAL); // 주기적으로 뉴스 데이터 새로고침
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
  }, [fetchNews]);

  // const currentNews: NewsItem | undefined = newsData[currentIndex];
  const currentNews = newsData[currentIndex];

  // 추가된 부분: 현재 뉴스 데이터를 콘솔에 출력
  useEffect(() => {
    if (currentNews) {
      console.log("Current news data:", {
        title: currentNews.title,
        summary: currentNews.summary,
        keywords: currentNews.keywords
      });
    }
  }, [currentNews]);


  const renderView = () => {
    switch (currentView) {
      case "main":
        return (
          <div className="flex flex-col items-center justify-center space-y-8">
            <HomeIcon />
            <div className="flex space-x-4">
              <YellowButton
                height={100}
                width={150}
                onClick={() => setCurrentView("learn")}
              >
                금융
                <br />
                배우기
              </YellowButton>
              <YellowButton
                height={100}
                width={150}
                onClick={() => setCurrentView("news")}
              >
                뉴스
              </YellowButton>
            </div>
            {/* <Avatar /> */}
            <img src={Avatar} alt="Avatar" className="w-24 h-24" />
          </div>
        );
      case "learn":
        return (
          <div className="flex flex-col items-center justify-center">
            <BlackText text="금융 배우기" boldChars={["금융"]} />
            {/* 여기에 금융 배우기 컨텐츠를 추가하세요 */}
            <YellowButton
              height={50}
              width={100}
              onClick={() => setCurrentView("main")}
            >
              뒤로
            </YellowButton>
          </div>
        );
      case "news":
        return (
          <div className="flex flex-col items-center justify-center">
            <BlackText text="오늘의 금융 소식" boldChars={["금융"]} />
            {isLoading ? ( // 로딩 중일 때 표시
              <div>Loading...</div>
            ) : error ? ( // 에러 발생 시 표시
              <div className="text-red-500">{error}</div>
            ) : currentNews ? ( // 뉴스 데이터가 있을 때 표시
              <YellowBox>
                {currentNews && (
                  <>
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
                      {currentNews.keywords.map(([keyword, _], index) => (
                        <span
                          key={index}
                          className="mb-2 mr-2 rounded bg-yellow-200 p-1"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </YellowBox>
            ) : (
              // 뉴스 데이터가 없을 때 표시
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
              onClick={() => setCurrentView("main")}
            >
              뒤로
            </YellowButton>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      {renderView()}
    </div>
  );
};

export default LearnNews;
