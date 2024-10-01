import React, { useEffect, useState } from "react";
import YellowBox from "../../components/YellowBox";
import BlackText from "../../components/BlackText";
import YellowButton from "../../components/YellowButton";
import { useLearnNewsStore } from "./useLearnNewsStore";
// import { NewsItem } from "./LearnNews.types";
import Avatar from "../../assets/avatar.png";
import Learn from "./Learn";
import { useNavigate } from "react-router-dom";
// 홈 아이콘 컴포넌트
const HomeIcon: React.FC = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <button 
      onClick={() => navigate('/main')} // 클릭 시 /main으로 이동
      className="flex h-20 w-20 items-center justify-center rounded-lg bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200"
    >
      <div className="text-2xl font-bold">
        처음
        <br />
        으로
      </div>
    </button>
  );
};

// 뉴스 데이터 새로고침 간격 (2시간)
const REFRESH_INTERVAL = 2 * 60 * 60 * 1000; 

const LearnNews: React.FC = () => {

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

  useEffect(() => {
    fetchNews(); // 컴포넌트 마운트 시 뉴스 데이터 가져오기
    const intervalId = setInterval(fetchNews, REFRESH_INTERVAL); // 주기적으로 뉴스 데이터 새로고침
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
  }, [fetchNews]);

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

  // 추가: 화면 크기에 따른 버튼 크기를 결정하는 함수
  const getButtonSize = () => {
    if (window.innerWidth >= 425) {
      return { height: 140, width: 160 };
    } else if (window.innerWidth >= 375) {
      return { height: 130, width: 140 };
    } else {
      return { height: 110, width: 130 };
    }
  };

  // 추가: 버튼 크기를 상태로 관리
  const [buttonSize, setButtonSize] = useState(getButtonSize());

  // 추가: 화면 크기 변경을 감지하고 버튼 크기를 업데이트하는 효과
  useEffect(() => {
    const handleResize = () => {
      setButtonSize(getButtonSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case "main":
        return (
          <div className="flex flex-col items-center justify-center space-y-8">
            <HomeIcon />
            {/* 변경: flex에서 grid로 변경하고 간격 조정 */}
            <div className="grid grid-cols-2 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
              {/* 변경: 각 버튼을 div로 감싸고 중앙 정렬 */}
              <div className="flex items-center justify-center">
                <YellowButton
                  height={buttonSize.height}
                  width={buttonSize.width}
                  onClick={() => setCurrentView("learn")}
                >
                  {/* 변경: 버튼 내부 텍스트 레이아웃 수정 */}
                  <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
                    <p className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]">
                      금융
                    </p>
                    <p className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]">
                      배우기
                    </p>
                  </div>
                </YellowButton>
              </div>
              <div className="flex items-center justify-center">
                <YellowButton
                  height={buttonSize.height}
                  width={buttonSize.width}
                  onClick={() => setCurrentView("news")}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
                    <p className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]">
                      뉴스
                    </p>
                  </div>
                </YellowButton>
              </div>
            </div>
            <img src={Avatar} alt="Avatar" className="w-24 h-24" />
          </div>
        );
      case "learn":
        return (
          <Learn />
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
                      {/* 아직 키워드는 맨 처음꺼 두 개만 뜸 */}
                      {currentNews.keywords.map(([keyword1, keyword2], index) => (
                        <span
                          key={index}
                          className="mb-2 mr-2 rounded bg-yellow-200 p-1"
                        >
                          {keyword1}, {keyword2}
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
