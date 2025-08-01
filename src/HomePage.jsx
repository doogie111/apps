
import React from 'react';
import { updates } from './updates';

function HomePage() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">업데이트 소식</h1>
      <div className="list-group">
        {updates.map((update, index) => (
          <div key={index} className="list-group-item list-group-item-action flex-column align-items-start mb-3">
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">[{update.date}] {update.title}</h5>
            </div>
            <p className="mb-1">{update.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
