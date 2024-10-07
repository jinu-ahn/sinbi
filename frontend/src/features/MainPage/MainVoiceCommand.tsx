import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";
import { sendToNLP } from "../../services/nlpApi";

import chooseFunction from "../../assets/audio/58_원하는_기능을_말하거나_눌러주세요.mp3"

const MainVoiceCommand: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { transcript, resetTranscript } = useSpeechRecognition();

  // 한국어를 듣게 지정 + 바뀌는 위치 (페이지)따라 들었다 멈췄다 함
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
    console.log("사용자가 한 말: ", transcript);
  }, [transcript]);

  const handleVoiceCommands = (text: string) => {
    const lowerCaseTranscript = text.toLowerCase();

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
    } else if (
      lowerCaseTranscript.includes("연습")
    ) {
      navigate("/sim-connect-account")
      resetTranscript();
    }
    if (
      lowerCaseTranscript.includes("신비") ||
      lowerCaseTranscript.includes("도와줘") ||
      lowerCaseTranscript.includes("도움") 
    ) {
      playAudio(chooseFunction);
      resetTranscript();
    }
    else {
      sendToNLP(transcript)
      .then((response) => {
        console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text)
        handleVoiceCommands(response.text)
        // resetTranscript();
      })
      .catch((error) => {
        console.error("nlp 보내는데 문제생김: ", error)
        // resetTranscript();
      })
      .finally(() => {
        resetTranscript();
      })
    }
  };

  // 빈 div 돌려줌 (자리차지안하게)
  return <div />;
};

export default MainVoiceCommand;