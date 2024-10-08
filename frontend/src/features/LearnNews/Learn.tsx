// Audio Handling: Moved the audio playback and cleanup logic into a useEffect that depends on currentLearnView.
// JSX Return: The main component now only returns valid JSX, removing the incorrect cleanup function return.

import React, { useState, useEffect } from "react";
import YellowButton from "../../components/YellowButton";
import BlackText from "../../components/BlackText";
import { useLearnNewsStore } from "./useLearnNewsStore";
import YouTube from "react-youtube";
import YellowBox from "../../components/YellowBox";
import CustomButton from "./CustomButton";
import { VideoTitles } from "./LearnNews.types";
import chooseLearnField from "../../assets/audio/62_배우고_싶은_분야를_말하거나_눌러주세요.mp3";
import chooseCaterotyTitle from "../../assets/audio/63_듣고_싶은_영상_제목을_말하거나_눌러주세요.mp3";
import sayMovieTitle from "../../assets/audio/63_듣고_싶은_영상_제목을_말하거나_눌러주세요.mp3";
import chooseLearnField from "../../assets/audio/62_배우고_싶은_분야를_말하거나_눌러주세요.mp3";
import chooseCaterotyTitle from "../../assets/audio/63_듣고_싶은_영상_제목을_말하거나_눌러주세요.mp3";
import sayMovieTitle from "../../assets/audio/63_듣고_싶은_영상_제목을_말하거나_눌러주세요.mp3";

type LearnViewType = "main" | "category" | "video";
type CategoryType = "financial" | "voice" | "fraud";

interface ButtonConfig {
  text: string[];
  category: CategoryType;
}

const SimLearn: React.FC = () => {
  const { setCurrentView } = useLearnNewsStore();
  const [currentLearnView, setCurrentLearnView] = useState<LearnViewType>("main");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

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

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    if (currentLearnView === "main") {
      audio = new Audio(chooseLearnField);
      audio.play();
    } else if (currentLearnView === "category") {
      audio = new Audio(chooseCaterotyTitle);
      audio.play();
    } else if (currentLearnView === "video") {
      audio = new Audio(sayMovieTitle);
      audio.play();
    }

    // Cleanup the audio when the component unmounts or when the view changes
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [currentLearnView]); // The effect should run whenever currentLearnView changes

  const getButtonSize = () => {
    if (window.innerWidth >= 425) {
      return { height: 140, width: 240 };
    } else if (window.innerWidth >= 375) {
      return { height: 130, width: 220 };
    } else {
      return { height: 110, width: 200 };
    }
  };

  const [buttonSize, setButtonSize] = useState(getButtonSize());

  useEffect(() => {
    const handleResize = () => {
      setButtonSize(getButtonSize());
    };


    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      <YellowButton
        height={50}
        width={100}
        onClick={() => setCurrentView("choice")}
      >
        뒤로
      </YellowButton>
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
      <YellowBox>
        <div className="grid w-full grid-cols-1 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
          {videoIds[selectedCategory!].map((_, index) => (
            <div key={index} className="flex w-full items-center justify-center">
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
      <YellowButton height={50} width={100} onClick={() => setCurrentLearnView("main")}>
        뒤로
      </YellowButton>
    </div>
  );

  const renderVideoView = () => (
    <div className="flex w-full flex-col items-center justify-center space-y-8">
      {selectedCategory && (
        <BlackText
          text={categoryTitles[selectedCategory].join(" ")}
          boldChars={categoryTitles[selectedCategory]}
        />
      )}
      <div className="aspect-video w-full">
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
      <div className="flex w-full max-w-sm justify-between">
        <YellowButton height={50} width={100} onClick={() => setCurrentLearnView("category")}>
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

export default Learn;


// import React, { useState, useEffect } from "react";
// import YellowButton from "../../components/YellowButton";
// import BlackText from "../../components/BlackText";
// import { useLearnNewsStore } from "./useLearnNewsStore";
// import YouTube from "react-youtube";
// import YellowBox from "../../components/YellowBox";
// import CustomButton from "./CustomButton";
// import { VideoTitles } from "./LearnNews.types";
// import chooseLearnField from "../../assets/audio/62_배우고_싶은_분야를_말하거나_눌러주세요.mp3"
// import chooseCaterotyTitle from "../../assets/audio/63_듣고_싶은_영상_제목을_말하거나_눌러주세요.mp3"
// import sayMovieTitle from "../../assets/audio/63_듣고_싶은_영상_제목을_말하거나_눌러주세요.mp3"

// type LearnViewType = "main" | "category" | "video";
// type CategoryType = "financial" | "voice" | "fraud";

// interface ButtonConfig {
//   text: string[];
//   category: CategoryType;
// }

// const Learn: React.FC = () => {
//   const { setCurrentView } = useLearnNewsStore();
//   const [currentLearnView, setCurrentLearnView] = useState<LearnViewType>("main");
//   const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

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

//   if(currentLearnView === 'main'){
//     const chooseLearnFieldAudio = new Audio(chooseLearnField);
//     chooseLearnFieldAudio.play();

//     return () => {
//       if (!chooseLearnFieldAudio.paused) {
//         chooseLearnFieldAudio.pause();
//         chooseLearnFieldAudio.currentTime = 0;
//       }
//     }
//   }
//   else if(currentLearnView === 'category'){
//     const chooseCaterotyTitleAudio = new Audio(chooseCaterotyTitle);
//     chooseCaterotyTitleAudio.play();

//     return () => {
//       if (!chooseCaterotyTitleAudio.paused) {
//         chooseCaterotyTitleAudio.pause();
//         chooseCaterotyTitleAudio.currentTime = 0;
//       }
//     }
//   } else if(currentLearnView === 'video') {
//     const sayMovieTitleAudio = new Audio(sayMovieTitle);
//     sayMovieTitleAudio.play();

//     return () => {
//       if (!sayMovieTitleAudio.paused) {
//         sayMovieTitleAudio.pause();
//         sayMovieTitleAudio.currentTime = 0;
//       }
//     }
//   }

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
//       <YellowButton
//         height={50}
//         width={100}
//         onClick={() => setCurrentView("choice")}
//       >
//         뒤로
//       </YellowButton>
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
//       <YellowBox>
//         <div className="grid w-full grid-cols-1 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
//           {videoIds[selectedCategory!].map((_, index) => (
//             <div
//               key={index}
//               className="flex w-full items-center justify-center"
//             >
//               <CustomButton
//                 height={buttonSize.height}
//                 width={buttonSize.width}
//                 onClick={() => {
//                   setCurrentLearnView("video");
//                   setCurrentVideoIndex(index);
//                 }}
//                 text={videoTitles[selectedCategory!][index]}
//               />
//             </div>
//           ))}
//         </div>
//       </YellowBox>
//       <YellowButton
//         height={50}
//         width={100}
//         onClick={() => setCurrentLearnView("main")}
//       >
//         뒤로
//       </YellowButton>
//     </div>
//   );

//   const renderVideoView = () => (
//     <div className="flex w-full flex-col items-center justify-center space-y-8">
//       {selectedCategory && (
//         <BlackText
//           text={categoryTitles[selectedCategory].join(" ")}
//           boldChars={categoryTitles[selectedCategory]}
//         />
//       )}
//       <div className="aspect-video w-full">
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
//       <div className="flex w-full max-w-sm justify-between">
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

// export default Learn;
