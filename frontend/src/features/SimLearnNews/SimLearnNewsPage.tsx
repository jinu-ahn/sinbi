import React, { useEffect } from "react";
import { useSimLearnNewsStore } from "./SimLearnNewsStore";
import SimLearn from "./SimLearn";
import SimChoice from "./SimChoice";
import SimNews from "./SimNews";
import SimLetsStartLearnNews from "./SimLetsStartLearnNews";
import SimLearnNewsVoiceCommand from "./SimLearnNewsVoiceCommand";

// 뉴스 데이터 새로고침 간격 (2시간)
const REFRESH_INTERVAL = 2 * 60 * 60 * 1000;

const SimLearnNews: React.FC = () => {
  const { currentView, fetchNews } = useSimLearnNewsStore();

  useEffect(() => {
    fetchNews(); // 컴포넌트 마운트 시 뉴스 데이터 가져오기
    const intervalId = setInterval(fetchNews, REFRESH_INTERVAL); // 주기적으로 뉴스 데이터 새로고침
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 제거
  }, [fetchNews]);

  //   1. choices 화면이 보임 (step 0)
    // - "금융 배우기"라고 말하세요.
  // 2. 세개의 카테고리 보임 (step 1)
    // - "슬기로운 금융생활이라고 말해보세요"
  // 3. 슬기로운 금융생활 진입 - 영상 제목 세개 보임 (step 2)
    // - "모바일뱅킹 고령자모드"라고 말해보세요.
  // 4. 영상 보임 (step 3)
    // - "이전"이라고 말하세요.
  // 5. "이전" 말해서 카테고리 세개로 다시 돌아옴 (step 4)
    // - ""이전"이라고 말하세요."
  // 6. "이전" 말해서 choice 화면으로 돌아옴 (step 5)
    // - "이제 "뉴스"라고 말해볼까요?"
  // 7. 뉴스 화면 진입 (step 6)
    // - "이제 "이전"이라고 말하세요"
  // 8. 다시 choices 화면이 보임
    // - "배우기가 끝났어요!! 어쩌구" => 오디오 끝나면 1초 뒤 자동으로 일반적인 /lean-news 페이지

  const renderView = () => {
    switch (currentView) {
      case "start":
        return <SimLetsStartLearnNews />;
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

      <SimLearnNewsVoiceCommand />
    </div>
  );
};

export default SimLearnNews;
