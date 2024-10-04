// // src/components/AppInitializer.tsx

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCookie } from "../utils/cookieUtils";
// import { tokenStorage } from "../features/User/tokenUtils";
// import { refreshAccessToken } from "../services/api";
// import TitlePage from '../titlepage';

// const AppInitializer: React.FC = () => {
//   const [isInitialized, setIsInitialized] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initializeApp = async () => {
//       // 로더 제거
//       // const loader = document.getElementById('loader');
//       // if (loader) {
//       //   loader.style.display = 'none';
//       // }
      
//       const storedPhone = getCookie("userPhone");
//       if (storedPhone) {
//         const refreshToken = tokenStorage.getRefreshToken();
//         if (refreshToken) {
//           try {
//             await refreshAccessToken();
//             // 잠시 대기 후 이동 (선택사항)
//             setTimeout(() => {
//               navigate("/main", { replace: true });
//             }, 1000);
//           } catch (error) {
//             console.error("Auto login failed:", error);
//             setTimeout(() => {
//               navigate("/welcome", { replace: true });
//             }, 1000);
//           }
//         } else {
//           setTimeout(() => {
//             navigate("/welcome", { replace: true });
//           }, 1000);
//         }
//       } else {
//         setTimeout(() => {
//           navigate("/welcome", { replace: true });
//         }, 1000);
//       }
//       setIsInitialized(true);
//     };

//     initializeApp();
//   }, [navigate]);

//   return <TitlePage />;
// };

// export default AppInitializer;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCookie } from "../utils/cookieUtils";
import { tokenStorage } from "../features/User/tokenUtils";
import { refreshAccessToken } from "../services/api";

const AppInitializer: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedPhone = getCookie("userPhone");
        if (storedPhone) {
          const refreshToken = tokenStorage.getRefreshToken();
          if (refreshToken) {
            await refreshAccessToken();
            navigate("/main", { replace: true });
          } else {
            navigate("/welcome", { replace: true });
          }
        } else {
          navigate("/welcome", { replace: true });
        }
      } catch (error) {
        console.error("Auto login failed:", error);
        navigate("/welcome", { replace: true });
      } finally {
        // 초기화가 완료되면 로더 제거
        const loader = document.getElementById('loader');
        if (loader) {
          loader.style.display = 'none';
        }
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, [navigate]);

  // 초기화 중에는 아무것도 렌더링하지 않음
  return null;
};

export default AppInitializer;