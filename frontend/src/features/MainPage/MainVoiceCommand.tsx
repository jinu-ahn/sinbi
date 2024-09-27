// import React, { useEffect } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import { useNavigate, useLocation } from "react-router-dom";

// const MainVoiceCommand: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { transcript, resetTranscript } = useSpeechRecognition();

//   const handleVoiceCommands = (transcript: string) => {
//     const lowerCaseTranscript = transcript.toLowerCase();

//     if (
//       lowerCaseTranscript.includes("송금") ||
//       lowerCaseTranscript.includes("이체") ||
//       lowerCaseTranscript.includes("계좌 이체") ||
//       lowerCaseTranscript.includes("보낼래") ||
//       lowerCaseTranscript.includes("돈 보내기")
//     ) {
//       navigate("/transfer");
//       resetTranscript();
//     } else if (
//       lowerCaseTranscript.includes("계좌 조회") ||
//       lowerCaseTranscript.includes("통장 조회") ||
//       lowerCaseTranscript.includes("계좌 보기") ||
//       lowerCaseTranscript.includes("통장 보기") ||
//       lowerCaseTranscript.includes("모든 통장")
//     ) {
//       navigate("/account-view");
//       resetTranscript();
//     } else if (
//       lowerCaseTranscript.includes("통장 등록") ||
//       lowerCaseTranscript.includes("계좌 연결") ||
//       lowerCaseTranscript.includes("연결") ||
//       lowerCaseTranscript.includes("등록")
//     ) {
//       navigate("/connect-account");
//       resetTranscript();
//     } else if (
//       lowerCaseTranscript.includes("뉴스") ||
//       lowerCaseTranscript.includes("배우기")
//     ) {
//       navigate("/learn-news");
//       resetTranscript();
//     }
//   };

//   useEffect(() => {
//     handleVoiceCommands(transcript);
//   }, [transcript]);

//   // Text-to-Speech (TTS) function
//   const speak = (text: string, lang = "ko-KR"): Promise<void> => {
//     return new Promise((resolve) => {
//       const voices = window.speechSynthesis.getVoices();
//       const selectedVoice = voices.find((voice) => voice.lang === lang);

//       const utterance = new SpeechSynthesisUtterance(text);
//       if (selectedVoice) {
//         utterance.voice = selectedVoice;
//       }

//       // When TTS ends, resolve the promise
//       utterance.onend = () => resolve();

//       window.speechSynthesis.speak(utterance);
//     });
//   };

//   useEffect(() => {
//     const runTTSAndListen = async () => {
//       if ("speechSynthesis" in window) {
//         console.log("TTS is supported in your browser.");
//       } else {
//         console.log("TTS is NOT supported in your browser.");
//         return;
//       }

//       // Stop listening while TTS is speaking
//       SpeechRecognition.stopListening();

//       // Run TTS and wait until it finishes
//       await speak("안녕하세요. 원하는 버튼을 클릭하거나 말씀해 주세요.", "ko-KR");

//       // After TTS is done, start listening again
//       SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
//     };

//     const voices = window.speechSynthesis.getVoices();

//     // Check if voices are available immediately
//     if (voices.length > 0) {
//       runTTSAndListen(); // Voices are available, proceed immediately
//     } else {
//       // Set up the onvoiceschanged event handler only once to avoid multiple triggers
//       const handleVoicesChanged = () => {
//         runTTSAndListen();
//         window.speechSynthesis.onvoiceschanged = null; // Remove handler after it's fired
//       };

//       window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
//     }

//     // Clean up function in case the component is unmounted
//     return () => {
//       window.speechSynthesis.onvoiceschanged = null; // Ensure the event listener is cleaned up
//     };
//   }, [location]);

//   // Return an empty div (for layout purposes)
//   return <div />;
// };

// export default MainVoiceCommand;


import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";
import howCanIHelp from "../../assets/audio/01_네_무엇을_도와드릴까요.mp3"

const MainVoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { transcript, resetTranscript } = useSpeechRecognition();

  //   한국어를 듣게 지정 + 바뀌는 위치 (페이지)따라 들었다 멈췄다 함
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [location]);

  // 오디오말하기
  const playAudio = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log(transcript);
  }, [transcript]);

  const handleVoiceCommands = (transcript: string) => {
    const lowerCaseTranscript = transcript.toLowerCase();

    // 계좌 관련 명령어
    if (
      lowerCaseTranscript.includes("송금") ||
      lowerCaseTranscript.includes("이체") ||
      lowerCaseTranscript.includes("계좌 이체") ||
      lowerCaseTranscript.includes("보낼래") ||
      lowerCaseTranscript.includes("돈 보내기")
    ) {
      navigate("/transfer");
      resetTranscript();
    } else if (
      lowerCaseTranscript.includes("계좌 조회") ||
      lowerCaseTranscript.includes("통장 조회") ||
      lowerCaseTranscript.includes("계좌 보기") ||
      lowerCaseTranscript.includes("통장 보기") ||
      lowerCaseTranscript.includes("모든 통장")
    ) {
      // "계좌" or "통장" refers to accounts
      navigate("/account-view");
      resetTranscript();
    } else if (
      lowerCaseTranscript.includes("통장 등록") ||
      lowerCaseTranscript.includes("계좌 연결") ||
      lowerCaseTranscript.includes("연결") ||
      lowerCaseTranscript.includes("등록")
    ) {
      navigate("/connect-account");
      resetTranscript();
    } else if (
      lowerCaseTranscript.includes("뉴스") ||
      lowerCaseTranscript.includes("배우기")
    ) {
      navigate("/learn-news");
      resetTranscript();
    }
    if (
      lowerCaseTranscript.includes("신비야") ||
      lowerCaseTranscript.includes("도와줘") ||
      lowerCaseTranscript.includes("도움") 
    ) {
      playAudio(howCanIHelp);
      resetTranscript();
    }
  };

  // 빈 div 돌려줌 (자리차지안하게)
  return <div />;
};

export default MainVoiceCommand;