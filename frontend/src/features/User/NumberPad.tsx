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
    <div className="number-pad">
        <div className="password-display">
            {[...Array(maxLength)].map((_,index) => (
                <div key={index} className={`password-dot ${index < value.length ? 'filled' : ''}`} />
            ))}
        </div>
        <div className="number-grid">
            {[1,2,3,4,5,6,7,8,9].map((num) => (
                <button key={num} onClick={()=> handleNumberClick(num)} className="number-button">
                    {num}
                </button>
            ))}
            <button onClick={handleDelete} className="number-button delete-button">삭제</button>
            <button onClick={() => handleNumberClick(0)} className="number-button">0</button>
        </div>
    </div>
  )
};

export default NumberPad