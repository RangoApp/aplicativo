import React, { useState, useRef } from 'react';
import './OTPInput.css';
const OTPInput = ({ onChange }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);
    onChange(newOtp.join(""));
    
    // Focus on next input
    if (element.value !== "" && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === "") {
        if (index > 0) {
          inputs.current[index - 1].focus();
        }
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").split("");
    if (pastedData.length === 6) {
      setOtp(pastedData);
      inputs.current[5].focus();
    }
  };

  return (
    <div onPaste={handlePaste}>
      {otp.map((data, index) => (
        <input
        placeholder='0'
          key={index}
          type="text"
          maxLength="1"
          className='otp-input'
          value={data}
          ref={(el) => (inputs.current[index] = el)}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          style={{
            width: "40px",
            height: "40px",
            margin: "5px",
            textAlign: "center",
            fontSize: "20px",
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
