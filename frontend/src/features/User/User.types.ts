export interface UserState {
  name: string | null;
  phoneNumber: string | null;
  setUser: (user: { name: string; phoneNumber: string }) => void;
  clearUser: () => void;
}

export interface UserData {
  name: string;
  phoneNumber: string;
  verificationCode: string;
  simplePassword: string;
  useFaceRecognition: boolean;
  webAuthnCredentialId?: string; // WebAuthn credential ID
  webAuthnPublicKey?: string; // WebAuthn public key
}

export enum SignUpStep {
  Welcome = "WELCOME",
  Name = "NAME",
  PhoneNumber = "PHONE_NUMBER",
  VerificationCode = "VERIFICATION_CODE",
  SimplePassword = "SIMPLE_PASSWORD",
  FaceRecognition = "FACE_RECOGNITION",
  FaceRegistration = "FACE_REGISTRATION",
  Completion = "COMPLETION",
}

// 단계 순서 정의 - 문자열 enum을 사용하면서도 순차적인 단계 진행 위함
export const stepOrder: SignUpStep[] = [
  SignUpStep.Welcome,
  SignUpStep.Name,
  SignUpStep.PhoneNumber,
  SignUpStep.VerificationCode,
  SignUpStep.SimplePassword,
  SignUpStep.FaceRecognition,
  SignUpStep.FaceRegistration,
  SignUpStep.Completion,
];
