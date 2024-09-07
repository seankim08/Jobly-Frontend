import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="LoadingSpinner">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner;