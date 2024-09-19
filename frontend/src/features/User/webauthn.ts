// import { PublicKeyCredentialCreationOptions, PublicKeyCredential } from '@types/webappsec-credential-management';
// webauthn.ts
// Base64 to ArrayBuffer 변환 함수
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// ArrayBuffer to Base64 변환 함수
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)))
  );
};

// BufferSource를 ArrayBuffer로 변환
const bufferSourceToArrayBuffer = (buffer: BufferSource): ArrayBuffer => {
  if (buffer instanceof ArrayBuffer) {
    return buffer;
  } else if (buffer instanceof Uint8Array) {
    return buffer.buffer;
  }
  // 다른 BufferSource 타입에 대한 처리를 추가할 수 있습니다.
  throw new Error("Unsupported BufferSource type");
};

function processWebAuthnOptions(
  options: any
): PublicKeyCredentialCreationOptions {
  return {
    ...options,
    challenge: base64ToArrayBuffer(options.challenge),
    user: {
      ...options.user,
      id: base64ToArrayBuffer(options.user.id),
    },
    pubKeyCredParams: options.pubKeyCredParams,
  };
}

// 브라우저의 WebAuthn API를 사용하여 새 크리덴셜을 생성
async function createCredential(
  options: PublicKeyCredentialCreationOptions
): Promise<PublicKeyCredential> {
  try {
    const credential = (await navigator.credentials.create({
      publicKey: options,
    })) as PublicKeyCredential;
    return credential;
  } catch (error) {
    console.error("Credential 생성 실패:", error);
    throw error;
  }
}

// 생성된 크리덴셜을 서버에 전송하여 등록
async function finishRegistration(
  credential: PublicKeyCredential
): Promise<any> {
  const response = credential.response as AuthenticatorAttestationResponse;

  const registrationData = {
    id: credential.id,
    rawId: arrayBufferToBase64(credential.rawId),
    response: {
      clientDataJSON: arrayBufferToBase64(response.clientDataJSON),
      attestationObject: arrayBufferToBase64(response.attestationObject),
    },
    type: credential.type,
  };

  const result = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/webauthn/register/finish`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    }
  );

  if (!result.ok) {
    throw new Error("Registration failed");
  }

  return await result.json();
}

// WebAuthn 등록 전체 과정
export async function completeWebAuthnRegistration(
  phone: string
): Promise<any> {
  try {
    // 1. 서버에서 옵션 받아오기
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/webauthn/register/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(phone),
      }
    );
    const options = await response.json();

    // 2. 옵션 처리
    const processedOptions = processWebAuthnOptions(options);

    // 3. Credential 생성
    const credential = await createCredential(processedOptions);

    // 4. 등록 완료
    const result = await finishRegistration(credential);

    console.log("WebAuthn 등록 완료:", result);
    return result;
  } catch (error) {
    console.error("WebAuthn 등록 실패:", error);
    throw error;
  }
}

// export const startWebAuthnRegistration = async (
//   phone: string
// ): Promise<PublicKeyCredentialCreationOptions> => {
//   try {
//     // 1. 서버에 등록 요청
//     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/register/start`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(phone),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     // const options = await response.json();
//     const options: PublicKeyCredentialCreationOptions = await response.json();

//     // 2. challenge와 user.id를 ArrayBuffer로 변환
//     options.challenge = bufferSourceToArrayBuffer(options.challenge);
//     options.user.id = bufferSourceToArrayBuffer(options.user.id);

//     return options;
//   } catch (error) {
//     console.error("WebAuthn 등록 시작 실패:", error);
//     throw error;
//   }
// };

// export const finishWebAuthnRegistration = async (
//   phone: string,
//   options: PublicKeyCredentialCreationOptions,
//   credential: PublicKeyCredential
// ): Promise<void> => {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/register/finish`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         phone,
//         requestOptions: options,
//         response: credential,
//       }),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const result = await response.text();
//     console.log(result);
//   } catch (error) {
//     console.error("WebAuthn 등록 완료 실패:", error);
//     throw error;
//   }
// };

// export const startWebAuthnAuthentication = async (
//   phone: string
// ): Promise<PublicKeyCredentialRequestOptions> => {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/login/start`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(phone),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const options = await response.json();

//     // challenge를 ArrayBuffer로 변환
//     options.publicKey.challenge = base64ToArrayBuffer(
//       options.publicKey.challenge
//     );

//     return options;
//   } catch (error) {
//     console.error("WebAuthn 인증 시작 실패:", error);
//     throw error;
//   }
// };

// export const finishWebAuthnAuthentication = async (
//   assertionRequest: PublicKeyCredentialRequestOptions,
//   credential: PublicKeyCredential
// ): Promise<void> => {
//   try {
//     const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/login/finish`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         assertionRequest,
//         response: credential,
//         // response: authResponse,
//       }),
//     });
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const result = await response.text();
//     console.log(result);
//   } catch (error) {
//     console.error("WebAuthn 인증 완료 실패:", error);
//     throw error;
//   }
// };

/////
// // 3. 브라우저에 credential 생성 요청
// const credential = (await navigator.credentials.create({
//   publicKey: options,
// })) as PublicKeyCredential;

// // 4. 생성된 credential을 서버로 전송
// const registrationResponse = await fetch("/webauthn/register", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     id: credential.id,
//     rawId: arrayBufferToBase64(credential.rawId),
//     response: {
//       clientDataJSON: arrayBufferToBase64(
//         (credential.response as AuthenticatorAttestationResponse)
//           .clientDataJSON
//       ),
//       attestationObject: arrayBufferToBase64(
//         (credential.response as AuthenticatorAttestationResponse)
//           .attestationObject
//       ),
//     },
//     type: credential.type,
//   }),
// });

// if (!registrationResponse.ok) {
//   throw new Error(`HTTP error! status: ${registrationResponse.status}`);
// }

// return registrationResponse.json();
