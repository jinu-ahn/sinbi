import axios from "axios";

const NLP_URL = import.meta.env.VITE_API_NLP_URL

// nlp ai로 보낼때
const nlpApi = axios.create({
  baseURL: NLP_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
})

// nlp 로 전송
export const sendToNLP = async (text: string) => {
  try {
    const response = await nlpApi.post("/correct", {
      text,
    });
    return response.data;
  } catch (error) {
    console.error("nlp로 보내는 데 실패: ", error);
    throw error;
  }
};

export default nlpApi;