import create from 'zustand';
import axios from 'axios';
import { LearnNewsStore, NewsItem, ViewType } from './LearnNews.types';

export const useLearnNewsStore = create<LearnNewsStore>((set, get) => ({
  newsData: [],
  currentIndex: 0,
  currentView: 'main' as ViewType,
  
  setNewsData: (data: NewsItem[]) => set({ newsData: data }),
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  setCurrentView: (view: ViewType) => set({ currentView: view }),
  
  fetchNews: async () => {
    try {
      const response = await axios.get<NewsItem[]>('http://127.0.0.1:5002/news');
      set({ newsData: response.data });
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  },
  
  handlePrevious: () => {
    const { newsData, currentIndex } = get();
    set({ currentIndex: currentIndex > 0 ? currentIndex - 1 : newsData.length - 1 });
  },
  
  handleNext: () => {
    const { newsData, currentIndex } = get();
    set({ currentIndex: currentIndex < newsData.length - 1 ? currentIndex + 1 : 0 });
  },
}));