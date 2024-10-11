// OTPCredential 타입 정의
export interface OTPCredential extends Credential {
  code: string; // OTP 인증번호
}
