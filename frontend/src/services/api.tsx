import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: BASE_URL,  // 일단 임시로 baseURL 설정
  timeout: 5000, // 5초안에 응답없으면 cancel
  headers: {
    'Content-Type': 'application/json',
  },
})

// 이제 밑에다가 필요한 api function 만들면 된다
// 계좌 존재하는지 체크
export const checkVirtualAccount = async (accountNum: string, bankTypeEnum: string) => {
  try {
    const response = await api.get('/virtualAccount/check', {
      params: {
        accountNum,
        bankTypeEnum,
      }
    });
    return response.data;
  } catch (error) {
    console.error('가상계좌가 존재하는지 찾을 수 없음: ', error);
    throw error;
  }
};

// 문자 전송
export const sendPhoneNumber = async (phoneNum: string) => {
  try {
    const response = await api.post('/sms/send', {
      phoneNum
    });
    return response.data;
  } catch (error) {
    console.error('핸드폰 번호 찾을 수 없음: ', error)
    throw error
  }
}

// 인증코드 확인
export const verificationCodeCheck = async (phoneNum: string, certificationCode: string) => {
  try {
    const response = await api.post('/sms/verify', {
      phoneNum,
      certificationCode
    })
    return response.data
  } catch (error) {
    console.error('인증코드 오류 발생: ', error)
    throw error
  }
}

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