import React, { useEffect } from "react";
import { useLearnNewsStore } from "./useLearnNewsStore";
import Learn from "./Learn";
import Choice from "./Choice";
import News from "./News";

// 뉴스 데이터 새로고침 간격 (2시간)
const REFRESH_INTERVAL = 2 * 60 * 60 * 1000;

const LearnNews: React.FC = () => {
  const { currentView, fetchNews } = useLearnNewsStore();

  useEffect(() => {
    fetchNews(); // 컴포넌트 마운트 시 뉴스 데이터 가져오기
    const intervalId = setInterval(fetchNews, REFRESH_INTERVAL); // 주기적으로 뉴스 데이터 새로고침
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
  }, [fetchNews]);


  const renderView = () => {
    switch (currentView) {
      case "choice":
        return <Choice />;
      case "learn":
        return <Learn />;
      case "news":
        return <News />;
      default:
        return <Choice />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      {renderView()}
    </div>
  );
};

export default LearnNews;
