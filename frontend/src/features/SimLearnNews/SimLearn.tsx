import React, { useState, useEffect } from "react";
import YellowButton from "../../components/YellowButton";
import BlackText from "../../components/BlackText";
import YouTube from "react-youtube";
import YellowBox from "../../components/YellowBox";
import CustomButton from "./CustomButton";
import SpeechBubble from "../../components/SpeechBubble";
import { useSimLearnNewsStore } from "./SimLearnNewsStore";
import { VideoTitles } from "./SimLearnNews.types";
import { CategoryType } from "./SimLearnNews.types";

import sayLearnOrNews from "../../assets/audio/81_여기서는_금융_지식을_배우거나_뉴스를_들을_수_있어요_우선은_금융_배우기.mp3"
import chooseLearnField from "../../assets/audio/82_여기서는_배우고_싶은_금융_지식의_분야를_고를_수_있어요.mp3";
import chooseCategoryTitle from "../../assets/audio/83_여기서_방금_고른_분야의_영상들을_확인할_수_있어요.mp3";
import sayMovieTitle from "../../assets/audio/85_여기서_영상을_보실_수_있어요.mp3";
import sayBefore from "../../assets/audio/86_이전_이라고_말해주세요.mp3";
import sayNews from "../../assets/audio/46_뉴스라고_말해보세요.mp3";
import learningDone from "../../assets/audio/84_배우기가_끝났어요_신비와_함께_지식을_늘려나가요.mp3";

const SimLearn: React.FC = () => {
  const {
    setCurrentLearnView,
    setSelectedCategory,
    currentLearnView,
    selectedCategory,
    currentVideoIndex,
    setCurrentVideoIndex,
    step,
    setStep,
  } = useSimLearnNewsStore();

  interface ButtonConfig {
    text: string[];
    category: CategoryType;
  }

  // Speech bubble texts and bold characters for each step
  const speechBubbleTexts = [
    { text: '"금융 배우기"라고 말하세요.', boldChars: ["금융", "배우기"] }, // step 0
    { text: '"금융 배우기"라고 말하세요.', boldChars: ["금융", "배우기"] }, // step 1
    {
      text: '"슬기로운\n금융생활"\n이라고\n말해보세요.',
      boldChars: ["슬기로운", "금융생활", "말"],
    }, // step 2
    { text: '"고령자모드"\n라고\n말해주세요.', boldChars: ["고령자모드"] }, // step 3
    { text: '"이전"이라고\n말해주세요.', boldChars: ["이전"] }, // step 4
    { text: '"이전"이라고\n말해주세요.', boldChars: ["이전"] }, // step 5
    { text: '"이전"이라고\n말해주세요.', boldChars: ["이전"] }, // step 6
    { text: '"이전"이라고\n말해주세요.', boldChars: ["이전"] }, // step 7
    { text: '"뉴스"라고\n말해보세요.', boldChars: ["뉴스"] }, // step 8
    { text: '"이전"이라고\n말해주세요.', boldChars: ["이전"] }, // step 9
    { text: "배우기 끝!\n신비와 함께\n지식을 늘려나가요!", boldChars: ["끝"] }, // step 10
  ];

  const buttons: ButtonConfig[] = [
    { text: ["슬기로운", "금융생활"], category: "financial" },
    { text: ["보이스피싱", "예방"], category: "voice" },
    { text: ["금융 사기", "예방"], category: "fraud" },
  ];

  const categoryTitles: { [key in CategoryType]: string[] } = {
    financial: ["슬기로운 금융생활"],
    voice: ["보이스피싱 예방"],
    fraud: ["금융 사기 예방"],
  };

  const videoIds = {
    financial: ["NNzNCT2mz_w", "TugQTgWTGis", "QM2XuplX1qQ"],
    voice: ["3QKvI5Og0nI", "0X9bOe9xttk", "CT2DXUFni2s"],
    fraud: ["ck4bsyH-HMw", "nSbaIgCC2WA", "AXxqPQYPmhg"],
  };

  const videoTitles: VideoTitles = {
    financial: [
      ["모바일뱅킹", "고령자모드"],
      ["모바일뱅킹", "활용법"],
      ["간편결제"],
    ],
    voice: [
      ["보이스피싱", "예방"],
      ["대면편취형", "보이스피싱"],
      ["기관사칭형", "보이스피싱"],
    ],
    fraud: [
      ["디지털금융", "사기"],
      ["금융 투자", "사기"],
      ["물품 판매", "사기"],
    ],
  };

  // 각 step 이랑 상응하는 audio
  const stepAudios = [
    sayLearnOrNews,
    sayLearnOrNews,
    chooseLearnField, // step 0
    chooseCategoryTitle, // step 1
    sayMovieTitle, // step 2
    sayBefore, // step 3
    sayBefore, // step 4
    sayNews, // step 5
    sayBefore, // step 6
    learningDone, // step 7
  ];

  // step별 오디오
  useEffect(() => {
    const audio = new Audio(stepAudios[step]);
    audio.play();

    return () => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [step]);

  useEffect(() => {
    const handleResize = () => setButtonSize(getButtonSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getButtonSize = () => {
    if (window.innerWidth >= 425) return { height: 140, width: 240 };
    if (window.innerWidth >= 375) return { height: 130, width: 220 };
    return { height: 110, width: 200 };
  };

  const [buttonSize, setButtonSize] = useState(() => getButtonSize());

  const renderMainView = () => (
    <div className="flex flex-col items-center justify-center space-y-8">
      <div className="grid grid-cols-1 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
        {buttons.map((button, index) => (
          <div key={index} className="flex items-center justify-center">
            <YellowButton
              height={buttonSize.height}
              width={buttonSize.width}
              onClick={() => {
                setCurrentLearnView("category");
                setStep(step + 1)
                setSelectedCategory(button.category);
              }}
            >
              <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
                {button.text.map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </YellowButton>
          </div>
        ))}
      </div>

      <div className="relative top-[-100px] z-20 mt-8 flex w-[300px] justify-center">
        <SpeechBubble
          text={speechBubbleTexts[step].text}
          boldChars={speechBubbleTexts[step].boldChars}
        />
      </div>
    </div>
  );

  const renderCategoryView = () => (
    <div className="flex w-full flex-col items-center justify-center space-y-8">
      {selectedCategory && (
        <BlackText
          text={categoryTitles[selectedCategory].join(" ")}
          boldChars={categoryTitles[selectedCategory]}
        />
      )}
      <div className="z-10 flex flex-col items-center justify-center">
        <YellowBox>
          <div className="grid w-full grid-cols-1 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
            {videoIds[selectedCategory!].map((_, index) => (
              <div
                key={index}
                className="flex w-full items-center justify-center"
              >
                <CustomButton
                  height={buttonSize.height}
                  width={buttonSize.width}
                  onClick={() => {
                    setCurrentLearnView("video");
                    setCurrentVideoIndex(index);
                  }}
                  text={videoTitles[selectedCategory!][index]}
                />
              </div>
            ))}
          </div>
        </YellowBox>
      </div>

      {/* 말풍선 */}
      <div className="relative top-[-250px] mt-8 flex w-[300px] justify-center">
        <SpeechBubble
          text={speechBubbleTexts[step].text}
          boldChars={speechBubbleTexts[step].boldChars}
        />
      </div>
    </div>
  );

  const renderVideoView = () => (
    <div className="z-10 flex w-full flex-col items-center justify-center space-y-8">
      {selectedCategory && (
        <BlackText
          text={categoryTitles[selectedCategory].join(" ")}
          boldChars={categoryTitles[selectedCategory]}
        />
      )}
      <div className="z-10 aspect-video w-full">
        <YouTube
          videoId={videoIds[selectedCategory!][currentVideoIndex]}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 1,
              origin: window.location.origin,
            },
          }}
          className="h-full w-full"
        />
      </div>
      {/* <div className="z-10 flex w-full max-w-sm justify-between">
        <YellowButton
          height={50}
          width={100}
          onClick={() => setCurrentLearnView("category")}
        >
          뒤로
        </YellowButton>
        <YellowButton
          height={50}
          width={100}
          onClick={() => {
            if (currentVideoIndex < videoIds[selectedCategory!].length - 1) {
              setCurrentVideoIndex(currentVideoIndex + 1);
            }
          }}
        >
          다음
        </YellowButton>
      </div> */}

      {/* 말풍선 */}
      <div className="relative top-[-10px] mt-8 flex w-[300px] justify-center">
        <SpeechBubble
          text={speechBubbleTexts[step].text}
          boldChars={speechBubbleTexts[step].boldChars}
        />
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentLearnView) {
      case "main":
        return renderMainView();
      case "category":
        return renderCategoryView();
      case "video":
        return renderVideoView();
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      {renderView()}
    </div>
  );
};

export default SimLearn;

// import React, { useState, useEffect } from "react";
// import YellowButton from "../../components/YellowButton";
// import BlackText from "../../components/BlackText";
// import YouTube from "react-youtube";
// import YellowBox from "../../components/YellowBox";
// import CustomButton from "./CustomButton";
// import { VideoTitles } from "./SimLearnNews.types";
// import { CategoryType } from "./SimLearnNews.types";
// import SpeechBubble from "../../components/SpeechBubble";
// import { useSimLearnNewsStore } from "./SimLearnNewsStore";

// import chooseLearnField from "../../assets/audio/82_여기서는_배우고_싶은_금융_지식의_분야를_고를_수_있어요.mp3";
// import chooseCaterotyTitle from "../../assets/audio/83_여기서_방금_고른_분야의_영상들을_확인할_수_있어요.mp3";
// import sayMovieTitle from "../../assets/audio/85_여기서_영상을_보실_수_있어요.mp3";
// import sayBefore from "../../assets/audio/86_이전_이라고_말해주세요.mp3"
// import sayNews from "../../assets/audio/46_뉴스라고_말해보세요.mp3"
// import learningDone from "../../assets/audio/84_배우기가_끝났어요_신비와_함께_지식을_늘려나가요.mp3";

// interface ButtonConfig {
//   text: string[];
//   category: CategoryType;
// }

// const SimLearn: React.FC = () => {
//   const {
//     setCurrentLearnView,
//     setSelectedCategory,
//     currentLearnView,
//     selectedCategory,
//     setCurrentVideoIndex,
//     currentVideoIndex,
//     setStep,
//     step,
//   } = useSimLearnNewsStore();

//   // ====================================================================================
//   // 말풍선 말 모음

//   // step 0 은 SimChoice에 있음

//   // step 1
//   const mainText = '"슬기로운\n금융생활"을\n말해보세요.';
//   const mainBoldChars = ["슬기로운", "금융생활", "말"];

//   // step 2
//   const categoryText = '"고령자모드"\n라고\n말해주세요.';
//   const categoryBoldChars = ["고령자모드", "말"];

//   // step 3 & step 4 & step 6
//   const sayBefore = '"이전"이라고\n말해주세요.';
//   const sayBeforeBoldChars = ["이전", "말"];

//   // step 5
//   const sayNews = '"뉴스"라고\n말해주세요.';
//   const sayNewsBoldChars = ["뉴스", "말"];

//   // step 8
//   const finalText = "배우기 끝!!\n신비와 함께\n금융 지식을\n늘려나가요!";
//   const finalBoldChars = ["끝"];

//   const buttons: ButtonConfig[] = [
//     { text: ["슬기로운", "금융생활"], category: "financial" },
//     { text: ["보이스피싱", "예방"], category: "voice" },
//     { text: ["금융 사기", "예방"], category: "fraud" },
//   ];

//   const categoryTitles: { [key in CategoryType]: string[] } = {
//     financial: ["슬기로운 금융생활"],
//     voice: ["보이스피싱 예방"],
//     fraud: ["금융 사기 예방"],
//   };

//   const videoIds = {
//     financial: ["NNzNCT2mz_w", "TugQTgWTGis", "QM2XuplX1qQ"],
//     voice: ["3QKvI5Og0nI", "0X9bOe9xttk", "CT2DXUFni2s"],
//     fraud: ["ck4bsyH-HMw", "nSbaIgCC2WA", "AXxqPQYPmhg"],
//   };

//   const videoTitles: VideoTitles = {
//     financial: [
//       ["모바일뱅킹", "고령자모드"],
//       ["모바일뱅킹", "활용법"],
//       ["간편결제"],
//     ],
//     voice: [
//       ["보이스피싱", "예방"],
//       ["대면편취형", "보이스피싱"],
//       ["기관사칭형", "보이스피싱"],
//     ],
//     fraud: [
//       ["디지털금융", "사기"],
//       ["금융 투자", "사기"],
//       ["물품 판매", "사기"],
//     ],
//   };

//   useEffect(() => {
//     let audio: HTMLAudioElement | null = null;

//     switch (currentLearnView) {
//       case "main":
//         audio = new Audio(chooseLearnField);
//         audio.play();
//         break;
//       case "category":
//         audio = new Audio(chooseCaterotyTitle);
//         audio.play();
//         break;
//       case "video":
//         audio = new Audio(sayMovieTitle);
//         audio.play();
//         break;
//     }

//     return () => {
//       if (audio && !audio.paused) {
//         audio.pause();
//         audio.currentTime = 0;
//       }
//     };
//   }, [currentLearnView]);

//   const getButtonSize = () => {
//     if (window.innerWidth >= 425) {
//       return { height: 140, width: 240 };
//     } else if (window.innerWidth >= 375) {
//       return { height: 130, width: 220 };
//     } else {
//       return { height: 110, width: 200 };
//     }
//   };

//   const [buttonSize, setButtonSize] = useState(getButtonSize());

//   const videoText = '"이전"이라고\n말해보세요.';
//   const videoBoldChars = ["이전", "말"];

//   useEffect(() => {
//     const handleResize = () => {
//       setButtonSize(getButtonSize());
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const renderMainView = () => (
//     <div className="flex flex-col items-center justify-center space-y-8">
//       <div className="grid grid-cols-1 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
//         {buttons.map((button, index) => (
//           <div key={index} className="flex items-center justify-center">
//             <YellowButton
//               height={buttonSize.height}
//               width={buttonSize.width}
//               onClick={() => {
//                 setCurrentLearnView("category");
//                 setSelectedCategory(button.category);
//               }}
//             >
//               <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
//                 {button.text.map((line, lineIndex) => (
//                   <p
//                     key={lineIndex}
//                     className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]"
//                   >
//                     {line}
//                   </p>
//                 ))}
//               </div>
//             </YellowButton>
//           </div>
//         ))}
//       </div>

//       <div className="relative top-[-20px] mt-8 flex w-[300px] justify-center">
//         <SpeechBubble text={mainText} boldChars={mainBoldChars} />
//       </div>
//     </div>
//   );

//   const renderCategoryView = () => (
//     <div className="flex w-full flex-col items-center justify-center space-y-8">
//       {selectedCategory && (
//         <BlackText
//           text={categoryTitles[selectedCategory].join(" ")}
//           boldChars={categoryTitles[selectedCategory]}
//         />
//       )}
//       <div className="z-10 flex flex-col items-center justify-center">
//         <YellowBox>
//           <div className="grid w-full grid-cols-1 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
//             {videoIds[selectedCategory!].map((_, index) => (
//               <div
//                 key={index}
//                 className="flex w-full items-center justify-center"
//               >
//                 <CustomButton
//                   height={buttonSize.height}
//                   width={buttonSize.width}
//                   onClick={() => {
//                     setCurrentLearnView("video");
//                     setCurrentVideoIndex(index);
//                   }}
//                   text={videoTitles[selectedCategory!][index]}
//                 />
//               </div>
//             ))}
//           </div>
//         </YellowBox>
//       </div>

//       {/* 말풍선 */}
//       <div className="relative top-[-250px] mt-8 flex w-[300px] justify-center">
//         <SpeechBubble text={categoryText} boldChars={categoryBoldChars} />
//       </div>
//     </div>
//   );

//   const renderVideoView = () => (
//     <div className="z-10 flex w-full flex-col items-center justify-center space-y-8">
//       {selectedCategory && (
//         <BlackText
//           text={categoryTitles[selectedCategory].join(" ")}
//           boldChars={categoryTitles[selectedCategory]}
//         />
//       )}
//       <div className="z-10 aspect-video w-full">
//         <YouTube
//           videoId={videoIds[selectedCategory!][currentVideoIndex]}
//           opts={{
//             width: "100%",
//             height: "100%",
//             playerVars: {
//               autoplay: 1,
//               origin: window.location.origin,
//             },
//           }}
//           className="h-full w-full"
//         />
//       </div>
//       {/* <div className="z-10 flex w-full max-w-sm justify-between">
//         <YellowButton
//           height={50}
//           width={100}
//           onClick={() => setCurrentLearnView("category")}
//         >
//           뒤로
//         </YellowButton>
//         <YellowButton
//           height={50}
//           width={100}
//           onClick={() => {
//             if (currentVideoIndex < videoIds[selectedCategory!].length - 1) {
//               setCurrentVideoIndex(currentVideoIndex + 1);
//             }
//           }}
//         >
//           다음
//         </YellowButton>
//       </div> */}

//       {/* 말풍선 */}
//       <div className="relative top-[-10px] mt-8 flex w-[300px] justify-center">
//         <SpeechBubble text={videoText} boldChars={videoBoldChars} />
//       </div>
//     </div>
//   );

//   const renderView = () => {
//     switch (currentLearnView) {
//       case "main":
//         return renderMainView();
//       case "category":
//         return renderCategoryView();
//       case "video":
//         return renderVideoView();
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
//       {renderView()}
//     </div>
//   );
// };

// export default SimLearn;
