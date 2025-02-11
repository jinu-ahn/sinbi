import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate } from "react-router-dom";
import { sendToNLP } from "../../services/nlpApi";
import { useLearnNewsSimDoneStore } from "../../store/LearnNewsSimDoneStore";
import { useAudioSTTControlStore } from "../../store/AudioSTTControlStore";

// import chooseFunction from "../../assets/audio/58_원하는_기능을_말하거나_눌러주세요.mp3";

const MainVoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const { transcript, resetTranscript } = useSpeechRecognition();
  const { done } = useLearnNewsSimDoneStore();
  const { isAudioPlaying } = useAudioSTTControlStore();

  // 사용자가 뭐라하는지 들어 + 오디오플레이 여부에 따라 들었다 안 들었다 함
  useEffect(() => {
    if (isAudioPlaying) {
      console.log("I will stop listening now.");
      SpeechRecognition.stopListening();
      console.log("I executed the stoplistening.");
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (!isAudioPlaying) {
      console.log("I will start listening now.");
      SpeechRecognition.startListening({
        continuous: true,
        language: "ko-KR",
      });
      console.log("I executed startlistening.");
    } else {
      SpeechRecognition.startListening({
        language: "ko-KR",
      });
      setTimeout(() => {
        SpeechRecognition.stopListening();
      }, 100);

      return () => {
        SpeechRecognition.stopListening();
      };
    }
  }, [isAudioPlaying]);

  // // 오디오말하기
  // const playAudio = (audioFile: string) => {
  //   const audio = new Audio(audioFile);
  //   audio.play();
  // };

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
      if (!done) {
        navigate("/sim-learn-news");
        resetTranscript();
      } else {
        navigate("/learn-news");
        resetTranscript();
      }
    } else if (lowerCaseTranscript.includes("연습")) {
      navigate("/sim-connect-account");
      resetTranscript();
    }
    // if (
    //   lowerCaseTranscript.includes("신비") ||
    //   lowerCaseTranscript.includes("도와줘") ||
    //   lowerCaseTranscript.includes("도움")
    // ) {
    //   playAudio(chooseFunction);
    //   resetTranscript();
    // } 
    else {
      sendToNLP(transcript)
        .then((response) => {
          if (response && response.text) {
            console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
            handleVoiceCommands(response.text);
          } else {
            console.error(
              "Received an unexpected response from NLP API: ",
              response,
            );
          }
          resetTranscript();
        })
        .catch((error) => {
          console.error("nlp 보내는데 문제생김: ", error);
          resetTranscript();
        });
    }
  };

  // 빈 div 돌려줌 (자리차지안하게)
  return <div />;
};

export default MainVoiceCommand;
