import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.example.com',  // 일단 임시로 baseURL 설정
  timeout: 5000, // 5초안에 응답없으면 cancel
  headers: {
    'Content-Type': 'application/json',
  },
})

// 이제 밑에다가 필요한 api function 만들면 된다

export default api