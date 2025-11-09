import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonLib, { type ButtonType } from '../ButtonLib/ButtonLib';

interface PageTitleProps {
  children: React.ReactNode;
  isButtonBack?: boolean;
}

export default function PageTitle({ children, isButtonBack }: PageTitleProps) {
  const navigate = useNavigate();

  const handleButtonClick = (type: ButtonType) => {
    if (type === 'back') {
      navigate(-1);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h4 style={{ color: "white", margin: 0, marginTop: 4, marginBottom: 12 }}>
        {children}
      </h4>
      {isButtonBack && (
        <ButtonLib type="back" onClick={handleButtonClick} />
      )}
    </div>
  );
}