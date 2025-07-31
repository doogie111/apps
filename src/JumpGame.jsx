
import React, { useState, useEffect, useRef } from 'react';

function JumpGame() {
  const [isJumping, setIsJumping] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [obstacleKey, setObstacleKey] = useState(0);
  const [obstacleHeight, setObstacleHeight] = useState(50);
  const [obstacleSpeed, setObstacleSpeed] = useState(2);

  const playerRef = useRef(null);
  const obstacleRef = useRef(null);
  const gameAreaRef = useRef(null);

  // Handle Jump
  const handleJump = () => {
    if (gameOver) return;

    if (jumpCount < 2) {
      setIsJumping(true);
      setJumpCount(prev => prev + 1);
    }
  };

  // Reset jump count when player lands
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleAnimationEnd = () => {
      setIsJumping(false);
      setJumpCount(0);
    };

    player.addEventListener('animationend', handleAnimationEnd);
    return () => player.removeEventListener('animationend', handleAnimationEnd);
  }, []);

  // Keyboard and click controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.type === 'click') {
        handleJump();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    const gameArea = gameAreaRef.current;
    gameArea.addEventListener('click', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      gameArea.removeEventListener('click', handleKeyPress);
    };
  }, [gameOver, jumpCount]);

  // Game loop for collision detection
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      const player = playerRef.current;
      const obstacle = obstacleRef.current;

      if (player && obstacle) {
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
          playerRect.right > obstacleRect.left &&
          playerRect.left < obstacleRect.right &&
          playerRect.bottom > obstacleRect.top
        ) {
          setGameOver(true);
          clearInterval(gameLoop);
        }
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver]);

  // Obstacle generation and scoring
  useEffect(() => {
    if (gameOver) return;

    const generateObstacle = () => {
      setScore(prev => prev + 1);
      setObstacleHeight(Math.floor(Math.random() * 41) + 20); // Random height: 20px to 60px
      setObstacleSpeed(Math.random() * 1 + 1.5); // Random speed: 1.5s to 2.5s
      setObstacleKey(key => key + 1);
    };

    const obstacleTimer = setInterval(generateObstacle, 2000);

    return () => clearInterval(obstacleTimer);
  }, [gameOver]);

  const handleRestart = () => {
    setScore(0);
    setGameOver(false);
    setJumpCount(0);
    setIsJumping(false);
    setObstacleKey(0);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">점프 게임 (2단 점프!)</h1>
      <div className="game-container">
        <div className="d-flex justify-content-between w-100 mb-2" style={{maxWidth: '600px'}}>
            <h4>점수: {score}</h4>
            {gameOver && <button className="btn btn-secondary" onClick={handleRestart}>다시 시작</button>}
        </div>
        <div className="game-area" ref={gameAreaRef}>
          <div ref={playerRef} className={`player ${isJumping ? 'jump' : ''}`}></div>
          {!gameOver && 
            <div 
              ref={obstacleRef} 
              key={obstacleKey} 
              className="obstacle" 
              style={{
                height: `${obstacleHeight}px`,
                animationDuration: `${obstacleSpeed}s`
              }}
            ></div>
          }
          {gameOver && (
            <div className="position-absolute top-50 start-50 translate-middle bg-dark text-white p-3 rounded">
              <h3>게임 오버</h3>
            </div>
          )}
        </div>
        <div className="form-text mt-2">스페이스바 또는 화면을 클릭하여 점프하세요. (2단 점프 가능)</div>
      </div>
    </div>
  );
}

export default JumpGame;
