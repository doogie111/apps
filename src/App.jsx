
import React, { useState } from 'react';
import Calculator from './Calculator';
import JumpGame from './JumpGame';
import CurrencyConverter from './CurrencyConverter';
import UnitConverter from './UnitConverter';
import HomePage from './HomePage'; // Import the new HomePage component
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // Set default page to 'home'

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'electricity':
        return <Calculator />;
      case 'currency':
        return <CurrencyConverter />;
      case 'unit':
        return <UnitConverter />;
      case 'game':
        return <JumpGame />;
      default:
        return <HomePage />;
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
                  className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
                  href="#"
                  onClick={() => setCurrentPage('home')}
                >
                  메인
                </a>
              </li>
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  id="navbarDropdown" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  계산기
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a 
                      className={`dropdown-item ${currentPage === 'electricity' ? 'active' : ''}`}
                      href="#"
                      onClick={() => setCurrentPage('electricity')}
                    >
                      전기요금 계산기
                    </a>
                  </li>
                  <li>
                    <a 
                      className={`dropdown-item ${currentPage === 'currency' ? 'active' : ''}`}
                      href="#"
                      onClick={() => setCurrentPage('currency')}
                    >
                      환율 계산기
                    </a>
                  </li>
                  <li>
                    <a 
                      className={`dropdown-item ${currentPage === 'unit' ? 'active' : ''}`}
                      href="#"
                      onClick={() => setCurrentPage('unit')}
                    >
                      단위 환산 계산기
                    </a>
                  </li>
                </ul>
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
