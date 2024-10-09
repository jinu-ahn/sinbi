import React, { useEffect } from "react";
import GreenText from "../../../components/GreenText";
import VerifyAudio from "../../../assets/audio/57_인증번호가_안_나오면_문자를_보고_알려주세요.mp3";
import useUserStore from "../useUserStore";
import { OTPCredential } from "../User.types"

const SmsVerificationStep: React.FC = () => {
  const { smsCode, setSmsCode, setIsAudioPlaying } = useUserStore();
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSmsCode(e.target.value);
  // };

  // 오디오말하기
  const audio = new Audio(VerifyAudio);

  // 오디오 플레이 (component가 mount될때만)
  useEffect(() => {
    setIsAudioPlaying(true)
    // 플레이시켜
    audio.play();

    audio.addEventListener("ended", () => {
      setIsAudioPlaying(false)
    })

    // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
    return () => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsAudioPlaying(true)
    };
  }, []);

  interface OTPCredentialRequestOptions extends CredentialRequestOptions {
    otp?: {
      transport: string[];
    };
  }

  // 타입 가드 함수 정의: Credential이 OTPCredential 타입인지 확인하는 함수
  function isOTPCredential(
    credential: Credential | null
  ): credential is OTPCredential {
    return credential !== null && "code" in credential;
  }

  // SMS 인증 번호 자동 인풋
  useEffect(() => {
    const getOTP = async () => {
      if ("OTPCredential" in window) {
        try {
          // 비동기 작업을 기다림
          const credential = await navigator.credentials.get({
            otp: { transport: ["sms"] },
          } as OTPCredentialRequestOptions);
          // 타입 가드를 사용하여 OTPCredential인지 검사
          if (isOTPCredential(credential)) {
            console.log("받은 OTP:", credential);
            setSmsCode(credential.code);
          }
        } catch (err) {
          console.error("SMS 인증 실패:", err);
        }
      }
    };
    getOTP();
  }, [setSmsCode]);

  return (
    <>
      <GreenText text="인증번호가" boldChars={["인증번호"]} />
      <GreenText text="안 나오면," boldChars={[]} />
      <GreenText text="문자를 보고" boldChars={["문자"]} />
      <GreenText text="알려주세요" boldChars={[]} />

      {/* Direct Input Field */}
      <input
        type="text"
        value={smsCode}
        onChange={(e) => setSmsCode(e.target.value)}
        maxLength={4} // or your OTP code length
        autoComplete="one-time-code" // Required for OTP autofill
        className="border p-2 text-center rounded-md text-lg" // Add your preferred styling here
        placeholder="인증번호를 입력하세요"
      />
    </>
  );
};

export default SmsVerificationStep;

// // src/components/User/SignUpStep/SmsVerificationStep.tsx
// import React, { useEffect } from "react";
// import GreenText from "../../../components/GreenText";
// import YellowButton from "../../../components/YellowButton";
// import NumberPad from "../NumberPad";
// import VerifyAudio from "../../../assets/audio/57_인증번호가_안_나오면_문자를_보고_알려주세요.mp3";
// import { OTPCredential } from "../User.types";

// interface SmsVerificationStepProps {
//   smsCode: string;
//   setSmsCode: (code: string) => void;
//   onVerifySms: () => Promise<void>;
// }

// const SmsVerificationStep: React.FC<SmsVerificationStepProps> = ({
//   smsCode,
//   setSmsCode,
//   onVerifySms,
// }) => {
//   // 오디오말하기
//   const audio = new Audio(VerifyAudio);

//   // 오디오 플레이 (component가 mount될때만)
//   useEffect(() => {
//     // 플레이시켜
//     audio.play();

//     // 근데 component가 unmount 되면 플레이 중지! 시간 0초로 다시 되돌려
//     return () => {
//       if (!audio.paused) {
//         audio.pause();
//         audio.currentTime = 0;
//       }
//     };
//   }, []);


  
//   interface OTPCredentialRequestOptions extends CredentialRequestOptions {
//     otp?: {
//       transport: string[];
//     };
//   }

// // 타입 가드 함수 정의: Credential이 OTPCredential 타입인지 확인하는 함수
// function isOTPCredential(credential: Credential | null): credential is OTPCredential {
//   return credential !== null && 'code' in credential;
// }


// // SMS 인증 번호 자동 인풋
// useEffect(() => {
//   const getOTP = async () => {
//     if ('OTPCredential' in window) {
//       try {
//         // 비동기 작업을 기다림
//         const credential = await navigator.credentials.get({
//           otp: { transport: ['sms'] },
//         } as OTPCredentialRequestOptions);

//         // 타입 가드를 사용하여 OTPCredential인지 검사
//         if (isOTPCredential(credential)) {
//           console.log('받은 OTP:', credential);
//           setSmsCode(credential.code);
//         } else {
//           console.error("실패 : " , credential);
//         }
//       } catch (err) {
//         console.error('SMS 인증 실패:', err);
//       }
//     }
//   };
//   getOTP();
// }, []);

//   return (
//     <>
//       <GreenText text="인증번호가" boldChars={["인증번호"]} />
//       <GreenText text="안 나오면," boldChars={[]} />
//       <GreenText text="문자를 보고" boldChars={["문자"]} />
//       <GreenText text="알려주세요" boldChars={[]} />
//       <NumberPad value={smsCode} onChange={setSmsCode} maxLength={4} />
//       <YellowButton height={50} width={200} onClick={onVerifySms}>
//         인증하기
//       </YellowButton>
//     </>
//   );
// };

// export default SmsVerificationStep;
