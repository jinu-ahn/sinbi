import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useUserStore from "./useUserStore";
import { SignUpStep } from "./User.types";
import { useLocation, useNavigate } from "react-router-dom";
import {
  login,
  sendPhoneNumber,
  signup,
  verificationCodeCheck,
} from "../../services/api";
import { sendToNLP } from "../../services/nlpApi";
import sayNext from "../../assets/audio/06_다음으로_넘어가려면_다음이라고_말해주세요.mp3";
const VoiceCommand: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    currentStep,
    name,
    phone,
    smsCode,
    password,
    confirmPassword,
    faceImage,
    // error,
    setName,
    setPhone,
    setSmsCode,
    setPassword,
    setConfirmPassword,
    setFaceImage,
    nextStep,
    prevStep,
    setStep,
    setError,
  } = useUserStore();

  const { transcript, resetTranscript } = useSpeechRecognition();
  // const [isListening, setIsListening] = useState(false);
  // const fileInputRef = useRef<HTMLInputElement>(null);

  const [previousName, setPreviousName] = useState(name);
  const [previousPhone, setPreviousPhone] = useState(phone);
  const [previousSmsCode, setPreviousSmsCode] = useState(smsCode);
  const [previousPassword, setPreviousPassword] = useState(password);
  const [previousConfirmPassword, setPreviousConfirmPassword] =
    useState(confirmPassword);

  const playAudio = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  // 한국어를 듣게 지정 + 바뀌는 위치 (페이지)따라 들었다 멈췄다 함
  useEffect(() => {
    SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    // return () => {
    //   SpeechRecognition.stopListening();
    // };
  }, [location]);

  useEffect(() => {
    handleVoiceCommands(transcript);
    console.log(transcript);
  }, [transcript]);

  const handleVoiceCommands = (text: string) => {
    const lowerCaseTranscript = text.toLowerCase();

    if (lowerCaseTranscript.includes("다 지워")) {
      resetCurrentField();
      resetTranscript();
      return;
    }

    if (lowerCaseTranscript.includes("하나 지워")) {
      removeLastCharacter();
      resetTranscript();
      return;
    }

    if (
      lowerCaseTranscript.includes("다음") ||
      lowerCaseTranscript.includes("넘어가")
    ) {
      handleNext();
      resetTranscript();
      return;
    }

    if (
      lowerCaseTranscript.includes("뒤로가") ||
      lowerCaseTranscript.includes("이전")
    ) {
      prevStep();
      resetTranscript();
      return;
    }

    if (
      lowerCaseTranscript.includes("신비야") ||
      lowerCaseTranscript.includes("도와줘")
    ) {
      playAudio(sayNext);
      resetTranscript();
      return;
    }

    switch (currentStep) {
      case SignUpStep.Welcome:
        if (lowerCaseTranscript.includes("시작")) {
          nextStep();
        }
        break;
      case SignUpStep.UserName:
        handleNameInput(text);
        break;
      case SignUpStep.UserPhone:
        handlePhoneInput(text);
        break;
      case SignUpStep.SmsVerification:
        handleSmsCodeInput(text);
        break;
      case SignUpStep.UserPassword:
        // handlePasswordInput(text);
        break;
      case SignUpStep.ConfirmPassword:
        // handleConfirmPasswordInput(text);
        if (
          lowerCaseTranscript.includes("다음") ||
          lowerCaseTranscript.includes("넘어가")
        ) {
          handlePasswordConfirmation();
        } else {
          handleConfirmPasswordInput(text);
        }
        break;
      case SignUpStep.StartFaceRecognition:
        if (lowerCaseTranscript.includes("시작")) {
          nextStep();
        } else if (lowerCaseTranscript.includes("아니")) {
          handleSignUp();
          setStep(SignUpStep.SignUpComplete);
        }
        break;
      case SignUpStep.FaceRecognitionInProgress:
        if (
          lowerCaseTranscript.includes("사진") ||
          lowerCaseTranscript.includes("찍어") ||
          lowerCaseTranscript.includes("해") ||
          lowerCaseTranscript.includes("시작")
        ) {
          // 여기서 카메라를 열고 사진을 찍는 로직을 추가해야 합니다.
          openCamera();
          console.log("사진 찍기 시도");
        }
        break;
      case SignUpStep.FaceRecognitionComplete:
        if (lowerCaseTranscript.includes("완료")) {
          handleSignUp();
        } else if (
          lowerCaseTranscript.includes("다음") ||
          lowerCaseTranscript.includes("넘어가") ||
          lowerCaseTranscript.includes("취소")
        ) {
          nextStep();
        }
        break;
      case SignUpStep.Login:
        if (lowerCaseTranscript.includes("로그인")) {
          handleLogin();
        }
        break;
    }

    if (
      lowerCaseTranscript.includes("집") ||
      lowerCaseTranscript.includes("시작 화면") ||
      lowerCaseTranscript.includes("처음")
    ) {
      resetAllFields();
      setStep(SignUpStep.Welcome);
      navigate("/");
      resetTranscript();
    } else {
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

  const resetCurrentField = () => {
    switch (currentStep) {
      case SignUpStep.UserName:
        setName("");
        setPreviousName("");
        break;
      case SignUpStep.UserPhone:
        setPhone("");
        setPreviousPhone("");
        resetTranscript();
        break;
      case SignUpStep.SmsVerification:
        setSmsCode("");
        setPreviousSmsCode("");
        break;
      case SignUpStep.UserPassword:
        setPassword("");
        setPreviousPassword("");
        break;
      case SignUpStep.ConfirmPassword:
        setConfirmPassword("");
        setPreviousConfirmPassword("");
        break;
    }
  };

  const removeLastCharacter = () => {
    switch (currentStep) {
      case SignUpStep.UserName:
        setName(name.slice(0, -1));
        setPreviousName(name.slice(0, -1));
        break;
      case SignUpStep.UserPhone:
        setPhone(phone.slice(0, -1));
        setPreviousPhone(phone.slice(0, -1));
        resetTranscript();
        break;
      // setPhone(phone.slice(0, -1));
      // setPreviousPhone(phone.slice(0, -1));
      // break;
      case SignUpStep.SmsVerification:
        setSmsCode(smsCode.slice(0, -1));
        setPreviousSmsCode(smsCode.slice(0, -1));
        break;
      case SignUpStep.UserPassword:
        setPassword(password.slice(0, -1));
        setPreviousPassword(password.slice(0, -1));
        break;
      case SignUpStep.ConfirmPassword:
        setConfirmPassword(confirmPassword.slice(0, -1));
        setPreviousConfirmPassword(confirmPassword.slice(0, -1));
        break;
    }
  };

  const handleNext = async () => {
    switch (currentStep) {
      case SignUpStep.UserPhone:
        await handleSendSms();
        break;
      case SignUpStep.SmsVerification:
        await handleVerifySms();
        break;
      case SignUpStep.ConfirmPassword:
        handlePasswordConfirmation();
        break;
      default:
        nextStep();
    }
  };

  const handleNameInput = (text: string) => {
    const newName = previousName + text.trim();
    setName(newName);
    setPreviousName(newName);
  };

  const handlePhoneInput = (text: string) => {
    const phoneNum = text.match(/\d+/g);
    if (phoneNum) {
      const newPhone = previousPhone + phoneNum.join("");
      setPhone(newPhone);
    }

    // const phoneNumber = transcript.match(/\d+/g);
    //   if (phoneNumber) {
    //     setPhone(previousPhoneNum + phoneNumberMatch.join(""));
    //   }
    // const lowerCaseText = text.toLowerCase();

    // // 숫자 입력 처리
    // const phoneNumberMatch = text.match(/\d+/g);
    // if (phoneNumberMatch) {
    //   // const newPhone = previousPhone + phoneNumberMatch.join("");
    //   // console.log("new phone: ", newPhone);
    //   setPhone(previousPhone + phoneNumberMatch.join(""));
    //   // setPreviousPhone(newPhone);
    // }

    // // "다 지워" 명령어 처리
    // if (lowerCaseText.includes("다 지워")) {
    //   setPhone("");
    //   setPreviousPhone("");
    //   resetTranscript();
    // }

    // // "하나 지워" 명령어 처리
    // if (lowerCaseText.includes("하나 지워")) {
    //   const newPhone = phone.slice(0, -1);
    //   setPhone(newPhone);
    //   setPreviousPhone(newPhone);
    //   resetTranscript();
    // }
  };

  const handleSmsCodeInput = (text: string) => {
    const smsCodeMatch = text.match(/\d+/g);
    if (smsCodeMatch) {
      const newSmsCode = previousSmsCode + smsCodeMatch.join("");
      setSmsCode(newSmsCode);
      // setPreviousSmsCode(newSmsCode);
    }
  };
  const openCamera = () => {
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  // const handlePasswordInput = (text: string) => {
  //   const passwordMatch = text.match(/\d+/g);
  //   if (passwordMatch) {
  //     const newPassword = previousPassword + passwordMatch.join("");
  //     setPassword(newPassword);
  //     setPreviousPassword(newPassword);
  //   }
  // };

  const handleConfirmPasswordInput = (text: string) => {
    const confirmPasswordMatch = text.match(/\d+/g);
    if (confirmPasswordMatch) {
      const newConfirmPassword =
        previousConfirmPassword + confirmPasswordMatch.join("");
      setConfirmPassword(newConfirmPassword);
      // setPreviousConfirmPassword(newConfirmPassword);
    }
  };

  const handleSendSms = async () => {
    try {
      await sendPhoneNumber(phone);
      setError(null);
      nextStep();
    } catch (error) {
      if (error instanceof Error) {
        setError(`sms 전송 중 오류가 발생했습니다: ${error.message}`);
      } else {
        setError("sms 전송 중 알 수 없는 오류가 발생했습니다.");
      }
      return false;
    }
  };

  const handleVerifySms = async () => {
    try {
      const response = await verificationCodeCheck(phone, smsCode);
      if (response.status === "인증이 되었습니다.") {
        setError(null);
        nextStep();
      } else {
        setError("인증 코드가 일치하지 않습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`SMS 인증 중 오류가 발생했습니다: ${error.message}`);
      } else {
        setError("SMS 인증 중 알 수 없는 오류가 발생했습니다.");
      }
      return false;
    }
  };

  const handlePasswordConfirmation = () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
      setStep(SignUpStep.UserPassword);
      setPassword("");
      setConfirmPassword("");
      setPreviousPassword("");
      setPreviousConfirmPassword("");
    } else {
      nextStep();
    }
  };

  const handleSignUp = async () => {
    try {
      const signUpData = {
        userName: name,
        userPhone: phone,
        userPassword: password,
      };
      await signup(signUpData, faceImage);
      setStep(SignUpStep.SignUpComplete);
    } catch (error) {
      if (error instanceof Error) {
        setError(`회원가입에 실패했습니다: ${error.message}`);
      } else {
        setError("회원가입 중 알 수 없는 오류가 발생했습니다.");
      }
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      const loginDto = {
        phone,
        password: faceImage ? undefined : password,
      };
      const response = await login(loginDto, faceImage);
      if (response.status === "SUCCESS") {
        navigate("/main");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(`로그인에 실패했습니다: ${error.message}`);
      } else {
        setError("로그인 중 알 수 없는 오류가 발생했습니다.");
      }
      return false;
    }
  };

  const resetAllFields = () => {
    setName("");
    setPhone("");
    setSmsCode("");
    setPassword("");
    setConfirmPassword("");
    setFaceImage(undefined);
    setPreviousName("");
    setPreviousPhone("");
    setPreviousSmsCode("");
    setPreviousPassword("");
    setPreviousConfirmPassword("");
    setError(null);
  };

  return <div />;
};

export default VoiceCommand;

// import React, { useEffect, useState, useRef } from "react";
// import SpeechRecognition, {
//   useSpeechRecognition,
// } from "react-speech-recognition";
// import useUserStore from "./useUserStore";
// import { SignUpStep } from "./User.types";
// import { useNavigate } from "react-router-dom";
// import {
//   login,
//   sendPhoneNumber,
//   signup,
//   verificationCodeCheck,
// } from "../../services/api";
// import { sendToNLP } from "../../services/nlpApi";

// const VoiceCommand: React.FC = () => {
//   const navigate = useNavigate();
//   const {
//     currentStep,
//     name,
//     phone,
//     smsCode,
//     password,
//     confirmPassword,
//     faceImage,
//     setName,
//     setPhone,
//     setSmsCode,
//     setPassword,
//     setConfirmPassword,
//     setFaceImage,
//     nextStep,
//     prevStep,
//     setStep,
//   } = useUserStore();

//   const [error, setError] = useState<string | null>(null);
//   const { transcript, resetTranscript } = useSpeechRecognition();
//   const [isListening, setIsListening] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isListening) {
//       SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
//     } else {
//       SpeechRecognition.stopListening();
//     }
//     return () => {
//       SpeechRecognition.stopListening();
//     };
//   }, [isListening]);

//   useEffect(() => {
//     handleVoiceCommand(transcript);
//   }, [transcript]);

//   const handleVoiceCommand = async (command: string) => {
//     const lowerCommand = command.toLowerCase();

//     // 공통 명령어
//     if (lowerCommand.includes("다음") || lowerCommand.includes("넘어가")) {
//       await handleNext();
//       resetTranscript();
//       return;
//     }
//     if (lowerCommand.includes("이전") || lowerCommand.includes("뒤로")) {
//       prevStep();
//       resetTranscript();
//       return;
//     }
//     if (
//       lowerCommand.includes("집") ||
//       lowerCommand.includes("시작 화면") ||
//       lowerCommand.includes("처음")
//     ) {
//       // 모든 상태 초기화
//       setName("");
//       setPhone("");
//       setSmsCode("");
//       setPassword("");
//       setConfirmPassword("");
//       setFaceImage(undefined);
//       setStep(SignUpStep.Welcome);
//       navigate("/sim");
//       resetTranscript();
//       return;
//     }

//     // 단계별 명령어 처리
//     switch (currentStep) {
//       case SignUpStep.Welcome:
//         if (lowerCommand.includes("시작")) {
//           nextStep();
//         }
//         break;
//       case SignUpStep.UserName:
//         setName(command.trim());
//         break;
//       case SignUpStep.UserPhone:
//         const phoneNumber = command.replace(/[^0-9]/g, "");
//         setPhone(phoneNumber);
//         break;
//       case SignUpStep.SmsVerification:
//         const smsCodeNumber = command.replace(/[^0-9]/g, "");
//         setSmsCode(smsCodeNumber);
//         break;
//       case SignUpStep.UserPassword:
//       case SignUpStep.ConfirmPassword:
//         const passwordNumber = command.replace(/[^0-9]/g, "");
//         if (currentStep === SignUpStep.UserPassword) {
//           setPassword(passwordNumber);
//         } else {
//           setConfirmPassword(passwordNumber);
//         }
//         break;
//       case SignUpStep.StartFaceRecognition:
//         if (lowerCommand.includes("시작")) {
//           nextStep();
//         }
//         break;
//       case SignUpStep.FaceRecognitionInProgress:
//         if (lowerCommand.includes("사진") || lowerCommand.includes("찍어")) {
//           openCamera();
//         }
//         break;
//       case SignUpStep.FaceRecognitionComplete:
//         if (lowerCommand.includes("완료")) {
//           await handleSignUp();
//         }
//         break;
//       case SignUpStep.Login:
//         if (lowerCommand.includes("로그인")) {
//           await handleLogin();
//         }
//         break;
//       default:
//         // NLP 처리
//         try {
//           const response = await sendToNLP(command);
//           if (response && response.text) {
//             console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
//             await handleVoiceCommand(response.text);
//           } else {
//             console.error(
//               "Received an unexpected response from NLP API: ",
//               response,
//             );
//           }
//         } catch (error) {
//           console.error("nlp 보내는데 문제생김: ", error);
//         }
//     }

//     resetTranscript();
//   };

//   const handleNext = async () => {
//     switch (currentStep) {
//       case SignUpStep.UserPhone:
//         await handleSendSms();
//         break;
//       case SignUpStep.SmsVerification:
//         await handleVerifySms();
//         break;
//       case SignUpStep.ConfirmPassword:
//         handlePasswordConfirmation();
//         break;
//       default:
//         nextStep();
//     }
//   };

//   const handleSendSms = async () => {
//     try {
//       await sendPhoneNumber(phone);
//       setError(null);
//       nextStep();
//     } catch (error) {
//       setError("SMS 전송에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   const handleVerifySms = async () => {
//     try {
//       const response = await verificationCodeCheck(phone, smsCode);
//       if (response.status === "인증이 되었습니다.") {
//         setError(null);
//         nextStep();
//       } else {
//         setError("인증 코드가 일치하지 않습니다. 다시 시도해주세요.");
//       }
//     } catch (error) {
//       setError("SMS 인증에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   const handlePasswordConfirmation = () => {
//     if (password !== confirmPassword) {
//       setError("비밀번호가 일치하지 않습니다. 다시 입력해주세요.");
//       setStep(SignUpStep.UserPassword);
//       setPassword("");
//       setConfirmPassword("");
//     } else {
//       nextStep();
//     }
//   };

//   const handleSignUp = async () => {
//     try {
//       const signUpData = {
//         userName: name,
//         userPhone: phone,
//         userPassword: password,
//       };
//       await signup(signUpData, faceImage);
//       nextStep();
//     } catch (error) {
//       setError("회원가입에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   const handleLogin = async () => {
//     try {
//       const loginDto = {
//         phone,
//         password: faceImage ? undefined : password,
//       };
//       const response = await login(loginDto, faceImage);
//       if (response.status === "SUCCESS") {
//         navigate("/main");
//       } else {
//         setError("로그인에 실패했습니다. 다시 시도해주세요.");
//       }
//     } catch (error) {
//       setError("로그인에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   // FaceRecognitionStep.tsx에서 가져온 로직
//   const openCamera = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setFaceImage(file);
//       nextStep(); // 사진 촬영 후 다음 단계로 자동 이동
//     }
//   };

//   // NLP 처리
//   // try {
//   //   const response = await sendToNLP(command);
//   //   if (response && response.text) {
//   //     console.log("nlp로 보내고 돌아온 데이터입니다: ", response.text);
//   //     await handleVoiceCommand(response.text);
//   //   } else {
//   //     console.error("Received an unexpected response from NLP API: ", response);
//   //   }
//   // } catch (error) {
//   //   console.error("nlp 보내는데 문제생김: ", error);
//   // } finally {
//   //   resetTranscript();
//   // }

//   return (
//     <div>
//       <button onClick={() => setIsListening(!isListening)}>
//         {isListening ? "음성 인식 중지" : "음성 인식 시작"}
//       </button>
//       {error && <p>{error}</p>}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageChange}
//         className="hidden"
//         ref={fileInputRef}
//         capture="user"
//       />
//     </div>
//   );
// };

// export default VoiceCommand;

// // import React, { useEffect } from "react";
// // import SpeechRecognition, {
// //   useSpeechRecognition,
// // } from "react-speech-recognition";
// // import useUserStore from "./useUserStore";
// // import { SignUpStep } from "./User.types";

// // const VoiceCommand: React.FC = () => {
// //   const { transcript, resetTranscript } = useSpeechRecognition();
// //   const { currentStep, nextStep, prevStep, setStep } = useUserStore();

// //   useEffect(() => {
// //     SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
// //     return () => {
// //       SpeechRecognition.stopListening();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     handleVoiceCommands(transcript);
// //   }, [transcript]);

// //   const handleVoiceCommands = (transcript: string) => {
// //     const lowerCaseTranscript = transcript.toLowerCase();

// //     if (
// //       lowerCaseTranscript.includes("다음") ||
// //       lowerCaseTranscript.includes("넘어가기")
// //     ) {
// //       nextStep();
// //       resetTranscript();
// //     } else if (
// //       lowerCaseTranscript.includes("이전") ||
// //       lowerCaseTranscript.includes("되돌아가기")
// //     ) {
// //       prevStep();
// //       resetTranscript();
// //     } else if (lowerCaseTranscript.includes("시작")) {
// //       if (
// //         currentStep === SignUpStep.Welcome ||
// //         currentStep === SignUpStep.StartFaceRecognition
// //       ) {
// //         nextStep();
// //         resetTranscript();
// //       }
// //     } else if (lowerCaseTranscript.includes("완료")) {
// //       if (currentStep === SignUpStep.FaceRecognitionComplete) {
// //         setStep(SignUpStep.SignUpComplete);
// //         resetTranscript();
// //       }
// //     } else if (lowerCaseTranscript.includes("로그인")) {
// //       if (currentStep === SignUpStep.SignUpComplete) {
// //         setStep(SignUpStep.Login);
// //         resetTranscript();
// //       }
// //     }
// //   };

// //   return null; // This component doesn't render anything
// // };

// // export default VoiceCommand;

// // // // VoiceCommand.tsx
// // // import React, { useEffect } from 'react';
// // // import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// // // import useUserStore from './useUserStore';

// // // const VoiceCommand: React.FC = () => {
// // //   const { transcript, resetTranscript } = useSpeechRecognition();
// // //   const { nextStep } = useUserStore();

// // //   useEffect(() => {
// // //     SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
// // //     return () => {
// // //       SpeechRecognition.stopListening();
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     handleVoiceCommands(transcript);
// // //   }, [transcript]);

// // //   const handleVoiceCommands = (transcript: string) => {
// // //     const lowerCaseTranscript = transcript.toLowerCase();

// // //     if (lowerCaseTranscript.includes("다음") || lowerCaseTranscript.includes("넘어가기")) {
// // //       nextStep();
// // //       resetTranscript();
// // //     }
// // //     // 여기에 다른 음성 명령을 추가할 수 있습니다.
// // //   };

// // //   return <div />; // 빈 div 반환
// // // };

// // // export default VoiceCommand;
