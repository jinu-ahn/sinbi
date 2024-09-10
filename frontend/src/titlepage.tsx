import React from "react";
import avatar from "./assets/avatar.png";

const TitlePage: React.FC = () => {
  return (
    <div className="relative h-screen flex flex-col items-center">
      <div className="mt-[100px]">
        {/* 제일 윗부분 */}
        <div className="mt-4 text-center">
          <h1 className="text-3xl mt-5 mb-5">
            은행을 안가도 <br /> 말로 편하게
          </h1>

          <div className="mt-10 mb-[60px]">
            {/* 신 뒤에 작은 노란원 */}
            <div className="relative inline-block">
              <div className="absolute left-[5px] top-[10px] transform -translate-y-1/2 bg-[#FFC700] rounded-full w-[20px] h-[20px] z-0"></div>
              <span className="relative z-10 text-[#0D690D] text-[50px] font-bold -mt-3 block">
                신
              </span>
            </div>

            {/* 비 뒤에 큰 노란원 */}
            <div className="relative inline-block top-5">
              <div className="absolute z-0 inset-0 left-[-20px] top-[-20px] bg-[#FFC700] rounded-full w-[90px] h-[90px] flex items-center justify-center mr-5"></div>
              <span className="relative z-10 text-[#0D690D] text-[50px] mt-5 font-bold">
                비
              </span>
            </div>
          </div>

          <h2 className="mt-4 mb-5 text-2xl font-bold text-[#0B4B24] relative">
            <p className="mr-10 mt-5 mb-5">어르신을 위한</p>
            <span className="ml-10 relative mt-5 mb-5">
              맞춤 은행 비서
              {/* "신" 위 노란 강조점 */}
              <div className="absolute -top-[65px] left-[20px] w-[10px] h-[10px] bg-[#FFC700] rounded-full"></div>
              {/* "비" 위 노란 강조점 */}
              <div className="absolute -top-3 left-[120px] w-[10px] h-[10px] bg-[#FFC700] rounded-full"></div>
            </span>
          </h2>
        </div>
      </div>

      {/* 아바타 들어갈 부분 */}
      <div className="mt-6 absolute bottom-1 flex flex-col items-center">
        <div className="w-40 h-40 overflow-hidden">
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TitlePage;
