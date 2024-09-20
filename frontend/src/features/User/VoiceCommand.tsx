import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import useUserStore from './useUserStore';
import { SignUpStep } from './User.types';

const VoiceCommand: React.FC = () => {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const { currentStep, nextStep, setStep } = useUserStore();

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  useEffect(() => {
    handleVoiceCommands(transcript);
  }, [transcript]);

  const handleVoiceCommands = (transcript: string) => {
    const lowerCaseTranscript = transcript.toLowerCase();

    if (lowerCaseTranscript.includes("다음") || lowerCaseTranscript.includes("넘어가기")) {
      nextStep();
      resetTranscript();
    } else if (lowerCaseTranscript.includes("시작")) {
      if (currentStep === SignUpStep.Welcome || currentStep === SignUpStep.StartFaceRecognition) {
        nextStep();
        resetTranscript();
      }
    } else if (lowerCaseTranscript.includes("완료")) {
      if (currentStep === SignUpStep.FaceRecognitionComplete) {
        setStep(SignUpStep.SignUpComplete);
        resetTranscript();
      }
    } else if (lowerCaseTranscript.includes("로그인")) {
      if (currentStep === SignUpStep.SignUpComplete) {
        setStep(SignUpStep.Login);
        resetTranscript();
      }
    }
  };

  return null; // This component doesn't render anything
};

export default VoiceCommand;


// // VoiceCommand.tsx
// import React, { useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import useUserStore from './useUserStore';

// const VoiceCommand: React.FC = () => {
//   const { transcript, resetTranscript } = useSpeechRecognition();
//   const { nextStep } = useUserStore();

//   useEffect(() => {
//     SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
//     return () => {
//       SpeechRecognition.stopListening();
//     };
//   }, []);

//   useEffect(() => {
//     handleVoiceCommands(transcript);
//   }, [transcript]);

//   const handleVoiceCommands = (transcript: string) => {
//     const lowerCaseTranscript = transcript.toLowerCase();

//     if (lowerCaseTranscript.includes("다음") || lowerCaseTranscript.includes("넘어가기")) {
//       nextStep();
//       resetTranscript();
//     }
//     // 여기에 다른 음성 명령을 추가할 수 있습니다.
//   };

//   return <div />; // 빈 div 반환
// };

// export default VoiceCommand;