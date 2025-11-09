import React from 'react';
import SkeletonLib from '../SkeletonLib/SkeletonLib';

interface FormLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  heightLoading?: number;
}

export default function FormLayout({ children, isLoading = false, heightLoading = 200 }: FormLayoutProps) {
  return (
    <div style={{
      // border: '1px solid #ccc',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6px 20px',
      marginBottom: '10px',
      marginTop: '13px'
    }}>
      {isLoading ? (
        <div style={{ gridColumn: '1 / -1' }}>
          <SkeletonLib width="100%" height={heightLoading} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}