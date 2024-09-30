import React from "react";
import YellowButton from "../../components/YellowButton";
import BlackText from "../../components/BlackText";
import SpeechBubble from "../../components/SpeechBubble";
import { useLearnNewsStore } from "./useLearnNewsStore";
import YouTube from "react-youtube";

// 새로운 타입 정의
type LearnViewType = "main" | "financial" | "voice" | "fraud" | "investment";

const Learn: React.FC = () => {
  const { setCurrentView } = useLearnNewsStore();
  const [currentLearnView, setCurrentLearnView] =
    React.useState<LearnViewType>("main");

  const renderLearnView = () => {
    switch (currentLearnView) {
      case "main":
        return (
          <div className="flex flex-col items-center justify-center space-y-8">
            <SpeechBubble
              text="배우고 싶은 주제를 선택해주세요"
              boldChars={["배우고"]}
            />
            <div className="grid grid-cols-2 gap-4">
              <YellowButton
                height={100}
                width={150}
                onClick={() => setCurrentLearnView("financial")}
              >
                슬기로운 금융생활
              </YellowButton>
              <YellowButton
                height={100}
                width={150}
                onClick={() => setCurrentLearnView("voice")}
              >
                보이스피싱 예방
              </YellowButton>
              <YellowButton
                height={100}
                width={150}
                onClick={() => setCurrentLearnView("fraud")}
              >
                금융 사기 예방
              </YellowButton>
              <YellowButton
                height={100}
                width={150}
                onClick={() => setCurrentLearnView("investment")}
              >
                금융 투자사기
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
      case "financial":
      case "voice":
      case "fraud":
      case "investment":
        return (
          <div className="flex flex-col items-center justify-center space-y-8">
            <BlackText
              text={`${currentLearnView} 학습`}
              boldChars={[currentLearnView]}
            />
            {/* <iframe 
              src="https://www.youtube.com/watch?v=NNzNCT2mz_w&list=PL1vn4GhXBYXqTci5Fu-D_DxJGoaemSwvi&index=25" 
              className="w-full h-[60vh]"
              title="Learning Content"
            /> */}
            {/* YouTube 동영상 iframe */}
            {/* <div className="w-full max-w-3xl aspect-video tabIndex={-1}">
              <iframe 
                className="w-full h-full border-0"
                src="https://www.youtube.com/embed/NNzNCT2mz_w?enablejsapi=1&playsinline=1" 
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div> */}
            {/* npm react-youtube */}
            <YouTube
              videoId="NNzNCT2mz_w"
              opts={{
                height: "390",
                width: "640",
                playerVars: {
                  autoplay: 1,
                },
              }}
            />
            <YellowButton
              height={50}
              width={100}
              onClick={() => setCurrentLearnView("main")}
            >
              뒤로
            </YellowButton>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      {renderLearnView()}
    </div>
  );
};

export default Learn;
