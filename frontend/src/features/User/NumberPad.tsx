import React, { useCallback, useEffect } from "react";
import "./NumberPad.css";

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
  const handleNumberClick = useCallback(
    (num: number) => {
      if (value.length < maxLength) {
        onChange(value + num);
      }
    },
    [value, onChange, maxLength],
  );

  const handleDelete = useCallback(() => {
    onChange(value.slice(0, -1));
  }, [value, onChange]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key >= '0' && event.key <= '9') {
      handleNumberClick(parseInt(event.key));
    } else if (event.key === 'Backspace') {
      handleDelete();
    }
  }, [handleNumberClick, handleDelete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="number-pad mx-auto max-w-md p-2 mobile-small:p-3 mobile-medium:p-4 mobile-large:p-5">
      <div className="password-display mb-4 flex justify-center mobile-medium:mb-5 mobile-large:mb-6">
        {[...Array(maxLength)].map((_, index) => (
          // <div key={index} className={`password-dot ${index < value.length ? 'filled' : ''}`} />
          <div
            key={index}
            className={`mx-2 h-4 w-4 rounded-full md:h-5 md:w-5 ${
              index < value.length ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="grid w-full grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className="number-button rounded-full bg-yellow-400 p-2 text-xl font-bold text-black transition-colors duration-200 hover:bg-yellow-500 mobile-small:p-3 mobile-small:text-2xl mobile-medium:p-4 mobile-medium:text-3xl mobile-large:p-5"
          >
            {num}
          </button>
        ))}
        <button onClick={handleDelete} className="number-button delete-button">
          삭제
        </button>
        <button
          onClick={() => handleNumberClick(0)}
          className="number-button rounded-full bg-yellow-400 p-2 text-xl font-bold text-black transition-colors duration-200 hover:bg-yellow-500 mobile-small:p-3 mobile-small:text-2xl mobile-medium:p-4 mobile-medium:text-3xl mobile-large:p-5"
        >
          0
        </button>
        {/* 아니 number-button class만 있을 때랑 차이가 없는데? ;;; 색깔이랑 폰트사이즈만 달라지는 것 같고,, 아닌가 */}
      </div>
    </div>
  );
};

export default NumberPad;
