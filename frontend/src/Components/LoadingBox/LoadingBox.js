import React from 'react';
import { Spinner } from 'react-bootstrap';
import './LoadingBox.css'
const LoadingBox = () => {
  return (
    <div className="spin">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingBox;
