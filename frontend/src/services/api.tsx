// src/services/api.tsx
import axios from "axios";
import { LoginDto, SignUpDto, TokenDto } from "../features/User/User.types";
// import { tokenStorage } from "../features/User/tokenUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
//도커파일 내부에서 그떄는 우리가 CICD를 안해서 git repo 안에다가 
jenkins가 도커이미지 만들어서 배포할떄 도커파일 ㅐㄴ부에 env 넣어서 패키징 해서 빌드하면 알아서 됨
그러고 비트 빌드시키면 됨
-> npm run build 된 걸 import 할 수 있다고??? 
react root에 env가 빌드할때 있어야 한다는 것. 

// 백엔드로 보낼때
const api = axios.create({
  baseURL: BASE_URL, // 일단 임시로 baseURL 설정
  timeout: 5000, // 5초안에 응답없으면 cancel
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 쿠키 포함해서 요청보냄
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
    console.log('api formdata: ',formData);

    const response = await api.post("/user/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log('회원가입시:',response)
    return response;
  } catch (error) {
    console.error("회원가입 불가: ", error);
    // throw error;
  }
};

// What: 요청 인터셉터를 추가하여 모든 요청에 인증 토큰을 첨부합니다.
// Why: 사용자 인증이 필요한 API 호출마다 수동으로 토큰을 추가하는 것을 방지하고, 중앙에서 일괄적으로 처리하기 위함입니다.
api.interceptors.request.use(
  (config) => {
    // const token = tokenStorage.getAccessToken();
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
// What: axios 인터셉터 추가
// Why: 401 에러 발생 시 토큰 갱신을 자동으로 시도하기 위함
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // What: 토큰 갱신 함수 호출
        // Why: 액세스 토큰이 만료되었을 때 새로운 토큰을 얻기 위함
        // await refreshAccessToken();
        // What: 원래 요청 재시도
        // Why: 새로운 토큰으로 실패했던 요청을 다시 시도하기 위함
        // What: 401 에러 발생 시 요청을 재시도합니다.
        // Why: 백엔드에서 자동으로 토큰을 갱신했을 수 있으므로, 한 번 더 시도합니다.
        return await api(originalRequest);
      } catch (retryError) {
        console.error("Token refresh failed:", retryError);
        // What: 토큰 제거 및 로그인 페이지로 리다이렉트
        // Why: 리프레시 토큰도 만료된 경우 사용자를 로그아웃 시키고 재로그인을 유도하기 위함
        // tokenStorage.clearTokens();
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(retryError);

        // What: 에러를 다시 throw
        // Why: 호출자에게 에러 상황을 알리기 위함
        // throw error;
      }
    }
    return Promise.reject(error);
  },
);
// What: 응답 인터셉터를 추가하여 인증 오류(401)를 처리합니다.
// Why: 액세스 토큰이 만료되었을 때 자동으로 리프레시 토큰을 사용하여 새 토큰을 발급받고, 원래의 요청을 재시도하기 위함입니다.
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // What: 리프레시 토큰을 사용하여 새 액세스 토큰을 요청합니다.
//         // Why: 만료된 액세스 토큰을 새것으로 교체하여 사용자 세션을 유지하기 위함입니다.
//         const refreshToken = tokenStorage.getRefreshToken();
//         const response = await api.post<TokenDto>("/user/refresh", { refreshToken });
//         const { accessToken, refreshToken: newRefreshToken } = response.data;

//         // What: 새로 받은 토큰들을 저장합니다.
//         // Why: 향후 API 요청에 사용하기 위해 최신 토큰을 유지합니다.
//         tokenStorage.setAccessToken(accessToken);
//         tokenStorage.setRefreshToken(newRefreshToken);

//         // What: 새 액세스 토큰을 요청 헤더에 설정합니다.
//         // Why: 재시도할 원래 요청에 새 토큰을 사용하기 위함입니다.
//         api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

//         // What: 원래의 요청을 새 토큰으로 재시도합니다.
//         // Why: 사용자 경험을 끊김 없이 유지하기 위함입니다.
//         return api(originalRequest);
//       } catch (refreshError) {
//         // What: 토큰 갱신에 실패하면 저장된 토큰을 삭제합니다.
//         // Why: 유효하지 않은 토큰을 제거하고, 사용자를 로그아웃 상태로 만들기 위함입니다.
//         tokenStorage.clearTokens();
//         // 여기에 로그아웃 처리 또는 로그인 페이지로 리다이렉트 로직을 추가할 수 있습니다.
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// 리프레시토큰 이용한 자동로그인 로직.. 구현중
export const refreshAccessToken = async (): Promise<TokenDto> => {
  try {
    // What: 임의의 보호된 엔드포인트로 요청
    // Why: JwtExceptionFilter에서 토큰 갱신 로직을 트리거하기 위함
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post("/user/login", null, {
      headers: {
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        refreshToken: refreshToken,
      },
    });

    // What: 응답 헤더에서 새로운 토큰 추출
    // Why: 백엔드에서 제공하는 새로운 토큰을 저장하기 위함
    const newAccessToken = response.headers["authorization"];
    const newRefreshToken = response.headers["refreshtoken"];

    if (newAccessToken && newRefreshToken) {
      // tokenStorage.setAccessToken(newAccessToken);
      // tokenStorage.setRefreshToken(newRefreshToken);
      // What: 새로운 토큰을 로컬 스토리지에 저장
      // Why: 향후 API 요청에 사용하기 위해 최신 토큰을 유지
      localStorage.setItem("accessToken", newAccessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
    }

    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// What: 로그인 함수입니다.
// Why: 사용자 인증을 처리하고 인증 토큰을 받아오기 위함입니다.
// 로그인 성공 시 토큰을 로컬스토리지에 저장 하기 위함
export const login = async (
  loginDto: LoginDto,
  image?: File,
): Promise<TokenDto> => {
  // What: FormData 객체를 생성하고 로그인 정보를 추가합니다.
  // Why: 멀티파트 형식으로 데이터를 전송하기 위함입니다. (이미지 파일 포함 가능)
  const formData = new FormData();
  formData.append(
    "loginDto",
    new Blob([JSON.stringify(loginDto)], { type: "application/json" }),
  );
  if (image) {
    formData.append("image", image);
  }
  try {
    // What: 로그인 요청을 보내고 응답을 받습니다.
    // Why: 서버에 인증을 요청하고 인증 토큰을 받아오기 위함입니다.
    const response = await api.post("/user/login", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("로그인 response: ", response);
    // 토큰은 응답 헤더에서 가져와야 함
    // const refreshToken = response.headers['refreshtoken'];

    // What: 받아온 토큰을 저장합니다.
    // Why: 향후 API 요청에 사용하기 위해 토큰을 로컬에 저장합니다.
    // if (accessToken && refreshToken) {
    //   tokenStorage.setAccessToken(accessToken);
    //   tokenStorage.setRefreshToken(refreshToken);
    // }

    // What: 토큰을 로컬 스토리지에 저장
    // Why: 자동 로그인 및 인증 상태 유지
    // What: 응답 헤더에서 토큰 추출 및 저장
    // Why: 로그인 성공 시 발급받은 토큰을 저장하여 인증 상태를 유지하기 위함
    const accessToken = response.headers["authorization"];
    // const refreshToken = response.headers["refreshtoken"];
    // console.log('리프레시토큰: ',refreshToken)
    console.log("access 토큰: ", accessToken);
    // if (accessToken && refreshToken) {
    //   localStorage.setItem("accessToken", accessToken);
    //   localStorage.setItem("refreshToken", refreshToken);
    //   console.log("Tokens stored in localStorage");
    // } else {
    //   console.error("Tokens not found in response headers");
    // }
    if (accessToken) {
      // 액세스 토큰을 로컬 스토리지나 상태에 저장
      localStorage.setItem("accessToken", accessToken);
      // 또는 tokenStorage.setAccessToken(accessToken);
    } else {
      console.error("Access token not found in response headers");
    }
    return response.data;
  } catch (error) {
    // What: 로그인 실패 시 에러를 로깅하고 다시 throw합니다.
    // Why: 디버깅을 용이하게 하고, 호출자에게 오류를 전파하기 위함입니다.
    console.error("Login failed: ", error);
    throw error;
  }
};

// 내 계좌들 조회
export const myAccounts = async (userId: number) => {
  try {
    const response = await api.get("/account", {
      params: {
        userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("계좌 없음", error);
    throw error;
  }
};

// 내 특정 계좌 조회
export const specificAccount = async (accountId: string) => {
  try {
    const response = await api.get(`/account/${accountId}/details`, {
      // params: {
      //   accountId,
      // },
    });
    return response.data;
  } catch (error) {
    console.error("해당 계좌 없음", error);
    throw error;
  }
};

// 계좌 이체
export const sendMoney = async (
  accountId: number,
  toAccountNum: string,
  toBankType: string,
  transferAmount: number,
) => {
  try {
    const response = await api.post("/account/transfer", {
      accountId,
      toAccountNum,
      toBankType,
      transferAmount,
    });
    return response.data;
  } catch (error) {
    console.error("이체할 수 없습니다: ", error);
    throw error;
  }
};

// 즐겨찾는 계좌에 등록
export const addFavorite = async (
  recvName: string,
  accountNum: string,
  bankTypeEnum: string,
  recvAlias: string,
) => {
  try {
    const response = await api.post("/receiverAccount/registration", {
      recvName,
      accountNum,
      bankTypeEnum,
      recvAlias,
    });
    return response.data;
  } catch (error) {
    console.error("이체할 수 없습니다: ", error);
    throw error;
  }
};

// 즐겨찾는 계좌 목록 보기
export const favoriteAccounts = async (userId: number) => {
  try {
    const response = await api.get("/receiverAccount/list", {
      params: {
        userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("해당 계좌 없음", error);
    throw error;
  }
};

export default api;