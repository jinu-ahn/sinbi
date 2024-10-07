import React, { useEffect } from "react";
import { useSimLearnNewsStore } from "./SimLearnNewsStore";
import SimLearn from "./SimLearn";
import SimChoice from "./SimChoice";
import SimNews from "./SimNews";
import SimLetsStartLearnNews from "./SimLetsStartLearnNews";
import SimDoneLearning from "./SimDoneLearning";

// 뉴스 데이터 새로고침 간격 (2시간)
const REFRESH_INTERVAL = 2 * 60 * 60 * 1000;

const SimLearnNews: React.FC = () => {
  const { currentView, fetchNews } = useSimLearnNewsStore();

  useEffect(() => {
    fetchNews(); // 컴포넌트 마운트 시 뉴스 데이터 가져오기
    const intervalId = setInterval(fetchNews, REFRESH_INTERVAL); // 주기적으로 뉴스 데이터 새로고침
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
  }, [fetchNews]);

  const renderView = () => {
    switch (currentView) {
      case "start":
        return <SimLetsStartLearnNews />;
      case "end":
        return <SimDoneLearning />;
      case "choice":
        return <SimChoice />;
      case "learn":
        return <SimLearn />;
      case "news":
        return <SimNews />;
      default:
        return <SimLetsStartLearnNews />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      {renderView()}
    </div>
  );
};

export default SimLearnNews;
