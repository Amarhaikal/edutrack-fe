import React from 'react';

interface SearchFormProps {
  children: React.ReactNode;
}

export default function SearchForm({ children }: SearchFormProps) {
  return (
    <div style={{ display: "flex", gap: "10px", paddingBottom: "4px" }}>
      {children}
    </div>
  );
}