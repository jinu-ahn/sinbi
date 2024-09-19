import { PublicKeyCredentialRequestOptions, PublicKeyCredential, AuthenticatorAssertionResponse } from '@types/webappsec-credential-management';

// Base64 문자열을 ArrayBuffer로 변환하는 함수
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// ArrayBuffer를 Base64 문자열로 변환하는 함수
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));
};

// WebAuthn 인증 시작 함수
export const startWebAuthnAuthentication = async (phone: string): Promise<PublicKeyCredentialRequestOptions> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/login/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const options: PublicKeyCredentialRequestOptions = await response.json();

    // challenge를 ArrayBuffer로 변환
    options.challenge = base64ToArrayBuffer(options.challenge as string);

    // 필요한 경우 allowCredentials도 변환
    if (options.allowCredentials) {
      options.allowCredentials = options.allowCredentials.map(credential => ({
        ...credential,
        id: base64ToArrayBuffer(credential.id as string),
      }));
    }

    return options;
  } catch (error) {
    console.error('WebAuthn 인증 시작 실패:', error);
    throw error;
  }
};

// WebAuthn 인증 완료 함수
export const finishWebAuthnAuthentication = async (
  credential: PublicKeyCredential
): Promise<any> => {
  try {
    const response = credential.response as AuthenticatorAssertionResponse;

    const authData = {
      id: credential.id,
      rawId: arrayBufferToBase64(credential.rawId),
      response: {
        authenticatorData: arrayBufferToBase64(response.authenticatorData),
        clientDataJSON: arrayBufferToBase64(response.clientDataJSON),
        signature: arrayBufferToBase64(response.signature),
        userHandle: response.userHandle ? arrayBufferToBase64(response.userHandle) : null,
      },
      type: credential.type,
    };

    const result = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/login/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData),
    });

    if (!result.ok) {
      throw new Error('Authentication failed');
    }

    return await result.json();
  } catch (error) {
    console.error('WebAuthn 인증 완료 실패:', error);
    throw error;
  }
};

// WebAuthn 인증 전체 과정을 처리하는 함수
export const completeWebAuthnAuthentication = async (phone: string): Promise<any> => {
  try {
    // 1. 인증 옵션 가져오기
    const options = await startWebAuthnAuthentication(phone);

    // 2. 크리덴셜 가져오기
    const credential = await navigator.credentials.get({ publicKey: options }) as PublicKeyCredential;

    // 3. 인증 완료
    const result = await finishWebAuthnAuthentication(credential);

    console.log('WebAuthn 인증 완료:', result);
    return result;
  } catch (error) {
    console.error('WebAuthn 인증 실패:', error);
    throw error;
  }
};