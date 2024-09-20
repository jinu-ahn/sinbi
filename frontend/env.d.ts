/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * API 기본 URL
   * 예: "http://localhost:8080" 또는 "https://api.example.com"
   */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}