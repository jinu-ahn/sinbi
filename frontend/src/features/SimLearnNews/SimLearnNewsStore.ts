import {create} from 'zustand';
import axios from 'axios';
import { LearnNewsStore, NewsItem, ViewType } from './LearnNews.types';

const API_URL = 'http://127.0.0.1:5002/news';

export const useSimLearnNewsStore = create<LearnNewsStore>((set, get) => ({
  newsData: [],
  currentIndex: 0,
  currentView: 'start' as ViewType,// 초기 뷰 설정
  isLoading: false, // 초기 로딩 상태는 false
  error: null, // 초기 에러 상태는 null
  
  setNewsData: (data: NewsItem[]) => set({ newsData: data }),
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  setCurrentView: (view: ViewType) => set({ currentView: view }),
  
  fetchNews: async () => {
    set({ isLoading: true, error: null }); // 데이터 로딩 시작 시 상태 업데이트
    try {
      const response = await axios.get<NewsItem[]>(API_URL);
      set({ newsData: response.data, isLoading: false }); // 성공 시 데이터 설정 및 로딩 상태 해제
    } catch (error) {
      console.error('Error fetching news:', error);
      set({ error: 'Failed to fetch news. Please try again later.', isLoading: false }); // 실패 시 에러 메시지 설정 및 로딩 상태 해제
    }
  },
  
  handlePrevious: () => {
    const { newsData, currentIndex } = get();
    // 이전 뉴스로 이동, 첫 번째 뉴스에서는 마지막 뉴스로 순환
    set({ currentIndex: currentIndex > 0 ? currentIndex - 1 : newsData.length - 1 });
  },
  
  handleNext: () => {
    const { newsData, currentIndex } = get();
    // 다음 뉴스로 이동, 마지막 뉴스에서는 첫 번째 뉴스로 순환
    set({ currentIndex: currentIndex < newsData.length - 1 ? currentIndex + 1 : 0 });
  },
}));