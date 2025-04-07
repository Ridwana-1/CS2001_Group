import React from 'react';
import '../styles/LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="spinner">
        {[...Array(12)].map((_, i) => (
          <div key={i} />
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner; 