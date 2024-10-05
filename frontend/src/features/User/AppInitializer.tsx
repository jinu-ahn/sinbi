import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookieUtils";
import { tokenStorage } from "./tokenUtils";
import { refreshAccessToken } from "../../services/api";

const AppInitializer: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isInitialized, setIsInitialized] = useState(false);
  const setInitialized = useCallback(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.style.display = "none";
    }
  }, []);
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
        const loader = document.getElementById("loader");
        if (loader) {
          loader.style.display = "none";
        }
        // setIsInitialized(true);
        setInitialized()
      }
    };

    initializeApp();
  }, [navigate, setInitialized]);

  // 초기화 중에는 아무것도 렌더링하지 않음
  return null;
};

export default AppInitializer;
