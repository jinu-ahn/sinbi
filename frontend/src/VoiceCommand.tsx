import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate, useLocation } from 'react-router-dom';

const VoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const { transcript, resetTranscript } = useSpeechRecognition();

  // Start continuous listening when the component mounts
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, [location]);

  // Trigger handleVoiceCommands every time the transcript changes
  useEffect(() => {
    handleVoiceCommands(transcript);
  }, [transcript]);

  // Function to handle voice commands and navigate to appropriate pages
  const handleVoiceCommands = (transcript: string) => {
    const lowerCaseTranscript = transcript.toLowerCase();

    // 계좌 관련 명령어
    if (lowerCaseTranscript.includes("송금") || lowerCaseTranscript.includes("이체") || lowerCaseTranscript.includes("계좌 이체")) { 
      navigate("/transfer");
      resetTranscript();
    } else if (lowerCaseTranscript.includes("계좌 조회") || lowerCaseTranscript.includes("통장 조회") || lowerCaseTranscript.includes("계좌 보기") || lowerCaseTranscript.includes("통장 보기") || lowerCaseTranscript.includes("통장")) { // "계좌" or "통장" refers to accounts
      navigate("/account-view");
      resetTranscript();
    } else if (lowerCaseTranscript.includes("계좌 등록") || lowerCaseTranscript.includes("통장 연결")) { // Register or connect account
      navigate("/connect-account");
      resetTranscript();
    } else if (lowerCaseTranscript.includes("뉴스") || lowerCaseTranscript.includes("배우기")) { // News or learn
      navigate("/learn-news");
      resetTranscript();
      // 메인 페이지 가는거
    } else if (lowerCaseTranscript.includes("집") || lowerCaseTranscript.includes("시작 화면") || lowerCaseTranscript.includes("처음")) {
      navigate("/home");
      resetTranscript();
    }
  };

  // 빈 div 돌려줌 (자리차지안하게)
  return <div />; 
};

export default VoiceCommand;