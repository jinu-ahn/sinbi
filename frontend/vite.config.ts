import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
// import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Shinbi",
        short_name: "Shinbi",
        description: "Mobile Banking App for Seniors",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      // 오프라인일때 캐시에서 가져오게해줌
      workbox: {
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-api-url\.com\/.*$/, // Adjust URL pattern based on your API
            handler: "NetworkFirst", // Try network first, fallback to cache if offline
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50, // Limit the number of cached entries
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/, // Cache image assets
            handler: "CacheFirst", // Use cache first for images
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // Cache for 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  // resolve: {
  //   alias: {
  //     // "/BankLogos": path.resolve(__dirname, "public/BankLogos"),
  //     "/BankLogos": "./public/BankLogos", // 주의: 이 경로는 빌드 시 public 폴더를 기준으로 합니다.
  //   },
  // },
});
