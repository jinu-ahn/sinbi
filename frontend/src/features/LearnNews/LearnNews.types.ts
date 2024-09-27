export interface NewsItem {
    title: string;
    summary: string;
    keywords: [string, number][];
  }
  
  export interface LearnNewsStore {
    newsData: NewsItem[];
    currentIndex: number;
    setNewsData: (data: NewsItem[]) => void;
    setCurrentIndex: (index: number) => void;
    fetchNews: () => Promise<void>;
    handlePrevious: () => void;
    handleNext: () => void;
  }
  
  // 새로 추가된 타입
  export type ViewType = 'main' | 'learn' | 'news';