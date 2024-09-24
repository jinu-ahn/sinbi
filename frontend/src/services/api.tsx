import axios from "axios";
import { LoginDto, SignUpDto } from "../features/User/User.types";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}`, // 일단 임시로 baseURL 설정
  timeout: 5000, // 5초안에 응답없으면 cancel
  headers: {
    "Content-Type": "application/json",
  },
});

// 이제 밑에다가 필요한 api function 만들면 된다

// api 요청
export const signup = async (signUpDto: SignUpDto, image?: File) => {
  const formData = new FormData();
  formData.append(
    "signUpDto",
    new Blob([JSON.stringify(signUpDto)], { type: "application/json" })
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

export const login = async (loginDto: LoginDto, image?: File) => {
  const formData = new FormData();
  formData.append(
    "loginDto",
    new Blob([JSON.stringify(loginDto)], { type: "application/json" })
  );
  if (image) {
    formData.append("image", image);
  }

  const response = await api.post("/user/login", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const sendSms = async (phoneNum: string) => {
  // console.log(phoneNum);
  // console.log(`"phoneNum": ${JSON.stringify( {phoneNum} )}`);
  const response = await api.post("/sms/send", { phoneNum });

  return response.data;
};

export const verifySms = async (phoneNum: string, certificationCode: string) => {
  console.log({ phoneNum, certificationCode })
  const response = await api.post("/sms/verify", { phoneNum, certificationCode });
  return response.data;
};

export default api;
