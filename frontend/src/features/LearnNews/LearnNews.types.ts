export interface NewsItem {
  title: string;
  summary: string;
  // keywords: [string, number][];
  keywords: Array<Array<[string, number]>>;
}

export interface LearnNewsStore {
  newsData: NewsItem[];
  currentIndex: number;
  currentVideoIndex: number;
  currentView: ViewType; // 새로 추가: 현재 뷰 상태
  isLoading: boolean; // 새로 추가: 로딩 상태를 나타내는 플래그
  error: string | null; // 새로 추가: 에러 메시지를 저장하는 상태
  currentLearnView: LearnViewType | "";
  selectedCategory: CategoryType | null;
  step: number;
  setStep: (newStep: number) => void;
  setCurrentVideoIndex: (index: number) => void;
  setCurrentLearnView: (view: LearnViewType | "") => void;
  setSelectedCategory: (category: CategoryType | null) => void;
  setNewsData: (data: NewsItem[]) => void;
  setCurrentIndex: (index: number) => void;
  setCurrentView: (view: ViewType) => void; // 새로 추가: 현재 뷰를 설정하는 함수
  fetchNews: () => Promise<void>;
  handlePrevious: () => void;
  handleNext: () => void;
}

// 새로 추가된 타입
export type ViewType = "choice" | "learn" | "news";
export type LearnViewType = "main" | "category" | "video";
export type CategoryType = "financial" | "voice" | "fraud";

// videoTitles의 타입을 정의합니다.
export interface VideoTitles {
  financial: string[][];
  voice: string[][];
  fraud: string[][];
}

// export interface NewsItem {
//   title: string;
//   summary: string;
//   keywords: [string, number][];
// }

// export interface LearnNewsStore {
//   newsData: NewsItem[];
//   currentIndex: number;
//   currentView: ViewType; // 새로 추가: 현재 뷰 상태
//   isLoading: boolean; // 새로 추가: 로딩 상태를 나타내는 플래그
//   error: string | null; // 새로 추가: 에러 메시지를 저장하는 상태
//   setNewsData: (data: NewsItem[]) => void;
//   setCurrentIndex: (index: number) => void;
//   setCurrentView: (view: ViewType) => void; // 새로 추가: 현재 뷰를 설정하는 함수
//   fetchNews: () => Promise<void>;
//   handlePrevious: () => void;
//   handleNext: () => void;
// }

// // 새로 추가된 타입
// export type ViewType = "choice" | "learn" | "news";

// // videoTitles의 타입을 정의합니다.
// export interface VideoTitles {
//   financial: string[][];
//   voice: string[][];
//   fraud: string[][];
// }