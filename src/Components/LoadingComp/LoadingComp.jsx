// Loading.js
import React from 'react';
import { Spinner } from 'reactstrap';

const Loading = () => {
  return (
    <div className="loading-container">
      <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
