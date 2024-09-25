import axios from "axios";
import { LoginDto, SignUpDto, TokenDto } from "../features/User/User.types";
import { tokenStorage } from "../features/User/tokenUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL, // 일단 임시로 baseURL 설정
  timeout: 5000, // 5초안에 응답없으면 cancel
  headers: {
    "Content-Type": "application/json",
  },
});

// 이제 밑에다가 필요한 api function 만들면 된다
// 계좌 존재하는지 체크
export const checkVirtualAccount = async (
  accountNum: string,
  bankTypeEnum: string,
) => {
  try {
    const response = await api.get("/virtualAccount/check", {
      params: {
        accountNum,
        bankTypeEnum,
      },
    });
    return response.data;
  } catch (error) {
    console.error("가상계좌가 존재하는지 찾을 수 없음: ", error);
    throw error;
  }
};

// 문자 전송
export const sendPhoneNumber = async (phoneNum: string) => {
  try {
    const response = await api.post("/sms/send", {
      phoneNum,
    });
    return response.data;
  } catch (error) {
    console.error("핸드폰 번호 찾을 수 없음: ", error);
    throw error;
  }
};

// 인증코드 확인
export const verificationCodeCheck = async (
  phoneNum: string,
  certificationCode: string,
) => {
  try {
    const response = await api.post("/sms/verify", {
      phoneNum,
      certificationCode,
    });
    return response.data;
  } catch (error) {
    console.error("인증코드 오류 발생: ", error);
    throw error;
  }
};

// 회원가입
export const signup = async (signUpDto: SignUpDto, image?: File) => {
  const formData = new FormData();
  formData.append(
    "signUpDto",
    new Blob([JSON.stringify(signUpDto)], { type: "application/json" }),
  );
  if (image) {
    formData.append("image", image);
  }
  try {
    console.log(signUpDto);
    console.log(formData);
    const response = await api.post("/user/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("회원가입 불가: ", error);
    throw error;
  }
};

// 로그인
// What: 요청 인터셉터를 추가하여 모든 요청에 인증 토큰을 첨부합니다.
// Why: 사용자 인증이 필요한 API 호출마다 수동으로 토큰을 추가하는 것을 방지하고, 중앙에서 일괄적으로 처리하기 위함입니다.
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// What: 응답 인터셉터를 추가하여 인증 오류(401)를 처리합니다.
// Why: 액세스 토큰이 만료되었을 때 자동으로 리프레시 토큰을 사용하여 새 토큰을 발급받고, 원래의 요청을 재시도하기 위함입니다.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // What: 리프레시 토큰을 사용하여 새 액세스 토큰을 요청합니다.
        // Why: 만료된 액세스 토큰을 새것으로 교체하여 사용자 세션을 유지하기 위함입니다.
        const refreshToken = tokenStorage.getRefreshToken();
        const response = await api.post<TokenDto>("/user/refresh", { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // What: 새로 받은 토큰들을 저장합니다.
        // Why: 향후 API 요청에 사용하기 위해 최신 토큰을 유지합니다.
        tokenStorage.setAccessToken(accessToken);
        tokenStorage.setRefreshToken(newRefreshToken);
        
        // What: 새 액세스 토큰을 요청 헤더에 설정합니다.
        // Why: 재시도할 원래 요청에 새 토큰을 사용하기 위함입니다.
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // What: 원래의 요청을 새 토큰으로 재시도합니다.
        // Why: 사용자 경험을 끊김 없이 유지하기 위함입니다.
        return api(originalRequest);
      } catch (refreshError) {
        // What: 토큰 갱신에 실패하면 저장된 토큰을 삭제합니다.
        // Why: 유효하지 않은 토큰을 제거하고, 사용자를 로그아웃 상태로 만들기 위함입니다.
        tokenStorage.clearTokens();
        // 여기에 로그아웃 처리 또는 로그인 페이지로 리다이렉트 로직을 추가할 수 있습니다.
      }
    }
    return Promise.reject(error);
  }
);

// 리프레시토큰 이용한 자동로그인 로직.. 구현중
export const refreshAccessToken = async (refreshToken: string): Promise<TokenDto> => {
  try {
    const response = await api.post<TokenDto>("/user/refresh", { refreshToken });
    
    const newAccessToken = response.headers['authorization'];
    const newRefreshToken = response.headers['refreshtoken'];
    
    if (newAccessToken && newRefreshToken) {
      tokenStorage.setAccessToken(newAccessToken);
      tokenStorage.setRefreshToken(newRefreshToken);
    }
    
    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// What: 로그인 함수입니다.
// Why: 사용자 인증을 처리하고 인증 토큰을 받아오기 위함입니다.
export const login = async (loginDto: LoginDto, image?: File): Promise<TokenDto> => {
  // What: FormData 객체를 생성하고 로그인 정보를 추가합니다.
  // Why: 멀티파트 형식으로 데이터를 전송하기 위함입니다. (이미지 파일 포함 가능)
  const formData = new FormData();
  formData.append(
    "loginDto",
    new Blob([JSON.stringify(loginDto)], { type: "application/json" })
  );
  if (image) {
    formData.append("image", image);
  }

  // What: 로그인 요청을 보내고 응답을 받습니다.
  // Why: 서버에 인증을 요청하고 인증 토큰을 받아오기 위함입니다.
  const response = await api.post<TokenDto>("/user/login", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // 토큰은 응답 헤더에서 가져와야 함
  const accessToken = response.headers['authorization'];
  const refreshToken = response.headers['refreshtoken'];
  
  // What: 받아온 토큰을 저장합니다.
  // Why: 향후 API 요청에 사용하기 위해 토큰을 로컬에 저장합니다.
  if (accessToken && refreshToken) {
    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(refreshToken);
  }
  return response.data;
};


// 내 계좌들 조회
export const myAccounts = async (userId: number) => {
  try {
    const response = await api.get('/account', {
      params: {
        userId,
      }
    });
    return response.data;
  } catch (error) {
    console.error('계좌 없음', error);
    throw error;
  }
}

// 내 특정 계좌 조회
export const specificAccount = async (accountId: string) => {
  try {
    const response = await api.get(`/account/${accountId}`, {
      params: {
        accountId,
      }
    });
    return response.data;
  } catch (error) {
    console.error('해당 계좌 없음', error);
    throw error;
  }
}

export default api