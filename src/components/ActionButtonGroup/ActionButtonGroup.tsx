import React from 'react';

interface ActionButtonGroupProps {
  children: React.ReactNode;
}

export default function ActionButtonGroup({ children }: ActionButtonGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        paddingBottom: "12px",
      }}
    >
      {children}
    </div>
  );
}