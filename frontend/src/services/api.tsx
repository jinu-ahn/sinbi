import axios from "axios";
import { LoginDto, SignUpDto } from "../features/User/User.types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 백엔드로 보낼때
const api = axios.create({
  baseURL: BASE_URL, // 일단 임시로 baseURL 설정
  timeout: 5000, // 5초안에 응답없으면 cancel
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
export const login = async (loginDto: LoginDto, image?: File) => {
  const formData = new FormData();
  formData.append(
    "loginDto",
    new Blob([JSON.stringify(loginDto)], { type: "application/json" }),
  );
  if (image) {
    formData.append("image", image);
  }

  const response = await api.post("/user/login", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
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

// 계좌 등록
export const registerAccount = async (accountNum: string, bankType: string) => {
  try {
    const response = await api.post("/account/create", {
      accountNum,
      bankType,
    });
    return response.data;
  } catch (error) {
    console.log(accountNum, bankType)
    console.error("통장 등록이 안됨: ", error);
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
    console.error("즐겨찾는 계좌 못 찾음", error);
    throw error;
  }
};

export default api;
