import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";

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
      lowerCaseTranscript.includes("보낼래")
    ) {
      navigate("/transfer");
      resetTranscript();
    } else if (
      lowerCaseTranscript.includes("계좌 조회") ||
      lowerCaseTranscript.includes("통장 조회") ||
      lowerCaseTranscript.includes("계좌 보기") ||
      lowerCaseTranscript.includes("통장 보기") ||
      lowerCaseTranscript.includes("통장")
    ) {
      // "계좌" or "통장" refers to accounts
      navigate("/account-view");
      resetTranscript();
    } else if (
      lowerCaseTranscript.includes("계좌 등록") ||
      lowerCaseTranscript.includes("통장 연결") ||
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
  };

  // 빈 div 돌려줌 (자리차지안하게)
  return <div />;
};

export default MainVoiceCommand;
