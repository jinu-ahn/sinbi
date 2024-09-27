import React from "react";
import { useNavigate } from "react-router-dom";
import YellowButton from "../../components/YellowButton";
// src url을 직접 쓰는게 아니라 여기서 import 해와야 나중에 avatar 경로가 바뀌어도 업데이트가 된다!!
import avatar from "../../assets/avatar.png";
import MainVoiceCommand from "./MainVoiceCommand";

interface ButtonConfig {
  text: string[];
  path: string;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const buttons: ButtonConfig[] = [
    { text: ["돈", "보내기"], path: "/transfer" },
    { text: ["모든", "통장"], path: "/account-view" },
    { text: ["통장", "등록"], path: "/connect-account" },
    { text: ["배우기", "/뉴스"], path: "/learn-news" },
  ];

  const handleNavigation = (path: string): void => {
    navigate(path);
  };

  // 추가: 화면 크기에 따른 버튼 크기를 결정하는 함수
  // 이유: 반응형 디자인을 구현하기 위해 화면 크기에 따라 버튼 크기를 동적으로 설정
  const getButtonSize = () => {
    if (window.innerWidth >= 425) {
      return { height: 140, width: 160 };
    } else if (window.innerWidth >= 375) {
      return { height: 130, width: 140 };
    } else {
      return { height: 110, width: 130 };
    }
  };

  // 추가: 버튼 크기를 상태로 관리
  // 이유: 화면 크기 변경에 따라 버튼 크기를 실시간으로 업데이트하기 위함
  const [buttonSize, setButtonSize] = React.useState(getButtonSize());

  // 추가: 화면 크기 변경을 감지하고 버튼 크기를 업데이트하는 효과
  // 이유: 화면 크기가 변경될 때마다 버튼 크기를 재계산하여 반응형 디자인 구현
  React.useEffect(() => {
    const handleResize = () => {
      setButtonSize(getButtonSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-between py-8">
      <div className="w-full max-w-md">
        <div className="grid grid-cols-2 gap-6 p-2 mobile-medium:gap-8 mobile-large:gap-10">
          {buttons.map((button, index) => (
            // grid 안에 감싸인 버튼들 중앙정렬하기 위해서 div로 한번더 감쌈
            <div key={index} className="flex items-center justify-center">
              <YellowButton
                //   key={index}
                // 변경: 고정 값 대신 동적으로 계산된 크기 사용
                // 이유: 화면 크기에 따라 버튼 크기를 조절하기 위함
                height={buttonSize.height}
                width={buttonSize.width}
                onClick={() => handleNavigation(button.path)}
              >
                {/* 변경: div 추가 및 클래스 수정 */}
                {/* 이유: 버튼 내부 컨텐츠의 레이아웃 개선 및 전체 영역 활용 */}
                <div className="flex h-full w-full flex-col items-center justify-center leading-relaxed">
                  {button.text.map((line, lineIndex) => (
                    <p
                      key={lineIndex}
                      className="text-center text-[30px] font-bold mobile-medium:text-[35px] mobile-large:text-[40px]"
                      // 변경: 클래스 수정
                      // 이유: 반응형 폰트 크기 적용
                      // - text-[30px]: 기본 폰트 크기 (320px 미만 화면)
                      // - mobile-medium:text-[35px]: 375px 이상 화면에서 35px
                      // - mobile-large:text-[40px]: 425px 이상 화면에서 40px
                      // - leading-tight: 줄 간격 조정으로 텍스트 배치 개선
                      // - leading-releaxed: 대략 160%정도의 줄간격
                    >
                      {line}
                    </p>
                  ))}
                </div>
                {/* 변경: 기존의 줄바꿈 로직 제거 */}
                {/* 이유: 각 텍스트 라인을 별도의 <p> 태그로 감싸 자동 줄바꿈 구현 */}
              </YellowButton>
            </div>
          ))}
        </div>
      </div>

      {/* 아바타 이미지 추가 */}
      <div className="absolute bottom-0 left-1/2 h-[300px] w-[318px] -translate-x-1/2 transform">
        <img
          src={avatar}
          alt="Avatar"
          className="h-full w-full object-contain"
        />
      </div>

      <MainVoiceCommand />
    </div>
  );
};

export default MainPage;
