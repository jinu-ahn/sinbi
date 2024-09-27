import React, { useState } from "react";
import YellowBox from "../../components/YellowBox";
import BlackText from "../../components/BlackText";
import YellowButton from "../../components/YellowButton";
import { useLearnNewsStore } from "./useLearnNewsStore";
import { NewsItem } from "./LearnNews.types";
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

const LearnNews: React.FC = () => {
  const [currentView, setCurrentView] = useState<"main" | "learn" | "news">(
    "main",
  );
  const { newsData, currentIndex, fetchNews, handlePrevious, handleNext } =
    useLearnNewsStore();

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const currentNews: NewsItem | undefined = newsData[currentIndex];

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
            {/* 여기에 캐릭터 이미지를 추가할 수 있습니다 */}
            <Avatar />
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
