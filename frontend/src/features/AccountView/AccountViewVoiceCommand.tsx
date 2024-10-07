import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useLocation } from "react-router-dom";
import { useAccountViewStore } from "./AccountViewStore";
import { sendToNLP } from "../../services/nlpApi";


const AccountViewVoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // store에서 필요한거 전부 import!!

  const { transcript, resetTranscript } = useSpeechRecognition();

  const {setSelectedAccount} = useAccountViewStore();

  // 사용자가 뭐라하는지 계속 들어
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [location]);

  // 사용자가 뭐라 더 말할때마다 (transcript가 바뀔때마다)
  // handleVoiceCommand에 집어넣어 (전부 lowercase로 바꿔줌)
  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log("Transcript: ", transcript);
  }, [transcript]);

  // transcript 전부 lowercase로 바꿔 (include로 키워드 찾을때 안걸리는 애들이 없도록 - 근데 사실 우린 한국어라 필요없긴해...)
  const handleVoiceCommands = (text: string) => {
    const lowerCaseTranscript = text.toLowerCase();

    // 일단 통장 이름을 불러서 상세 계좌 조회로 들어가는 로직은 없음!!!
    if (
      lowerCaseTranscript.includes("이전") ||
      lowerCaseTranscript.includes("뒤로")
    ) {
      navigate("/account-view")
      setSelectedAccount(null)
      resetTranscript();
    }
    if (
      lowerCaseTranscript.includes("집") ||
      lowerCaseTranscript.includes("시작 화면") ||
      lowerCaseTranscript.includes("처음")
    ) {
      navigate("/main");
      resetTranscript();
    }
    else {
      sendToNLP(transcript)
        .then((response) => {
          if (response && response.text) {
            console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
            handleVoiceCommands(response.text);
          } else {
            console.error("Received an unexpected response from NLP API: ", response);
          }
          resetTranscript();
        })
        .catch((error) => {
          console.error("nlp 보내는데 문제생김: ", error);
          resetTranscript();
        });
    }
  };

  return <div />;
};

export default AccountViewVoiceCommand;
