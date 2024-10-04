// src/features/User/tokenUtils.ts
// What: 토큰 저장소 인터페이스 정의
// Why: 토큰 저장 방식을 추상화하여 쉽게 변경할 수 있도록
export interface TokenStorage {
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  getRefreshToken: () => string | null;
  setRefreshToken: (token: string) => void;
  clearTokens: () => void;
}

// class LocalStorageTokenStorage implements TokenStorage {
//   getAccessToken() {
//     return localStorage.getItem('accessToken');
//   }

//   setAccessToken(token: string) {
//     localStorage.setItem('accessToken', token);
//   }

//   getRefreshToken() {
//     return localStorage.getItem('refreshToken');
//   }

//   setRefreshToken(token: string) {
//     localStorage.setItem('refreshToken', token);
//   }

//   clearTokens() {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//   }
// }

// What: 쿠키 기반 토큰 저장소 구현
// Why: 보안을 강화하고 XSS 공격에 대한 취약성을 줄이기 위해 쿠키를 사용합니다.
import { getCookie, setCookie, deleteCookie } from "../../utils/cookieUtils";

class CookieTokenStorage implements TokenStorage {
  getAccessToken() {
    // return getCookie("accessToken");
    return localStorage.getItem("accessToken");
  }

  setAccessToken(token: string) {
    // setCookie("accessToken", token, 1); // 1일 유효
    localStorage.setItem("accessToken", token);
  }

  getRefreshToken() {
    // return getCookie("refreshToken");
    return null // 리프레시 토큰은 HTTP-only 쿠키로 저장되므로 프론트엔드에서 접근할 수 없음
  }

  setRefreshToken(token: string) {
    // setCookie("refreshToken", token, 30); // 30일 유효
    // 리프레시 토큰은 서버에서 자동으로 쿠키에 설정되므로 여기서는 아무 작업도 하지 않음
  }

  clearTokens() {
    localStorage.removeItem("accessToken");
    // deleteCookie("accessToken");
    // deleteCookie("refreshToken");
  }
}


// 현재는 로컬 스토리지를 사용
// export const tokenStorage: TokenStorage = new LocalStorageTokenStorage();

// 쿠키로 전환 시 아래 라인의 주석을 해제하고 위 라인을 주석 처리하기
export const tokenStorage: TokenStorage = new CookieTokenStorage();
