import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'primary' }) => {
  const styles = {
    primary: "bg-blue-100 text-blue-800 border-blue-200",
    secondary: "bg-slate-100 text-slate-800 border-slate-200",
    accent: "bg-amber-100 text-amber-800 border-amber-200"
  };

  // Logic to auto-assign colors based on text content if needed, otherwise default to primary
  let activeStyle = styles.primary;
  
  if (text.includes('CCF-A') || text.includes('ESI') || text.includes('一区')) {
    activeStyle = "bg-red-50 text-red-700 border-red-100 font-semibold";
  } else if (text.includes('CCF-B') || text.includes('二区')) {
    activeStyle = "bg-blue-50 text-blue-700 border-blue-100";
  } else {
    activeStyle = "bg-slate-50 text-slate-600 border-slate-200";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${activeStyle} mr-2 mb-1`}>
      {text}
    </span>
  );
};