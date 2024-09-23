import React from "react";
import './NumberPad.css'

interface NumberPadProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

const NumberPad: React.FC<NumberPadProps> = ({
  value,
  onChange,
  maxLength,
}) => {
  const handleNumberClick = (num: number) => {
    if (value.length < maxLength) {
      onChange(value + num);
    }
  };

  const handleDelete = () => {
    onChange(value.slice(0,-1))
  }

  return(
    <div className="number-pad p-2 mobile-small:p-3 mobile-medium:p-4 mobile-large:p-5 max-w-md mx-auto">
        <div className="password-display flex justify-center mb-4 mobile-medium:mb-5 mobile-large:mb-6
        ">
            {[...Array(maxLength)].map((_,index) => (
                // <div key={index} className={`password-dot ${index < value.length ? 'filled' : ''}`} />
                <div key={index} className={`w-4 h-4 md:w-5 md:h-5 rounded-full mx-2 ${
              index < value.length ? "bg-black" : "bg-gray-300"
            }`} />
            ))}
        </div>
        <div className="grid grid-cols-3 gap-4 md:gap-6 w-full">
            {[1,2,3,4,5,6,7,8,9].map((num) => (
                <button key={num} onClick={()=> handleNumberClick(num)} className="number-button bg-yellow-400 text-black rounded-full p-2 mobile-small:p-3 mobile-medium:p-4 mobile-large:p-5 text-xl mobile-small:text-2xl mobile-medium:text-3xl font-bold hover:bg-yellow-500 transition-colors duration-200">
                    {num}
                </button>
            ))}
            <button onClick={handleDelete} className="number-button delete-button">삭제</button>
            <button onClick={() => handleNumberClick(0)} className="number-button bg-yellow-400 text-black rounded-full p-2 mobile-small:p-3 mobile-medium:p-4 mobile-large:p-5 text-xl mobile-small:text-2xl mobile-medium:text-3xl font-bold hover:bg-yellow-500 transition-colors duration-200">0</button>
            {/* 아니 number-button class만 있을 때랑 차이가 없는데? ;;; 색깔이랑 폰트사이즈만 달라지는 것 같고,, 아닌가 */}
        </div>
    </div>
  )
};

export default NumberPad