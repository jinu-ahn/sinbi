export interface TokenStorage {
    getAccessToken: () => string | null;
    setAccessToken: (token: string) => void;
    getRefreshToken: () => string | null;
    setRefreshToken: (token: string) => void;
    clearTokens: () => void;
  }
  
  class LocalStorageTokenStorage implements TokenStorage {
    getAccessToken() {
      return localStorage.getItem('accessToken');
    }
  
    setAccessToken(token: string) {
      localStorage.setItem('accessToken', token);
    }
  
    getRefreshToken() {
      return localStorage.getItem('refreshToken');
    }
  
    setRefreshToken(token: string) {
      localStorage.setItem('refreshToken', token);
    }
  
    clearTokens() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
  
  // 쿠키 기반 저장소로 전환 시 이 클래스를 구현
  class CookieTokenStorage implements TokenStorage {
    // 여기에 쿠키 기반 구현을 추가합니다.
    // 현재는 더미 구현만 포함합니다.
    getAccessToken() { return null; }
    setAccessToken(token: string) {}
    getRefreshToken() { return null; }
    setRefreshToken(token: string) {}
    clearTokens() {}
  }
  
  // 현재는 로컬 스토리지를 사용
  export const tokenStorage: TokenStorage = new LocalStorageTokenStorage();
  
  // 쿠키로 전환 시 아래 라인의 주석을 해제하고 위 라인을 주석 처리하기
  // export const tokenStorage: TokenStorage = new CookieTokenStorage();