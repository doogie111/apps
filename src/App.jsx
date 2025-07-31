
import React, { useState } from 'react';
import Calculator from './Calculator';
import JumpGame from './JumpGame'; // Import the new game component
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('info'); // 'info' or 'game'

  const renderPage = () => {
    switch (currentPage) {
      case 'info':
        return <Calculator />;
      case 'game':
        return <JumpGame />;
      default:
        return <Calculator />;
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">다용도 앱</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a 
                  className={`nav-link ${currentPage === 'info' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setCurrentPage('info')}
                >
                  생활정보
                </a>
              </li>
              <li className="nav-item">
                <a 
                  className={`nav-link ${currentPage === 'game' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setCurrentPage('game')}
                >
                  게임
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
