/// <reference types="vite/client" />

interface ImportMetaEnv {
    /**
     * API 기본 URL
     * 예: "http://localhost:8080" 또는 "https://api.example.com"
     */
    readonly VITE_API_BASE_URL: string
  
    /**
     * 현재 환경 (development, production, test)
     */
    readonly MODE: string
  
    /**
     * 앱이 프로덕션 모드로 실행 중인지 여부
     */
    readonly PROD: boolean
  
    /**
     * 앱이 개발 모드로 실행 중인지 여부
     */
    readonly DEV: boolean
  
    // 여기에 추가적인 환경 변수들을 선언할 수 있습니다.
    // 예:
    // readonly VITE_FEATURE_FLAG: string
    // readonly VITE_API_KEY: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }