import React from 'react';

const InlineSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={`w-8 h-8 border-2 border-gray-200 border-t-green-600 rounded-full animate-spin ${className}`}></div>
  );
};

export default InlineSpinner; 