'use client';

import { useEffect, useRef, useState } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameState {
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  gameOver: boolean;
  paused: boolean;
  started: boolean;
  difficulty: Difficulty;
  fps: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  life: number;
  maxLife: number;
  color: string;
}

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: 0,
    combo: 0,
    maxCombo: 0,
    gameOver: false,
    paused: false,
    started: false,
    difficulty: 'medium',
    fps: 60,
  });

  const gameStateRef = useRef(gameState);
  const ballRef = useRef<Ball>({
    x: 400,
    y: 300,
    dx: 4,
    dy: 4,
    radius: 8,
  });

  const paddleRef = useRef<Paddle>({
    x: 50,
    y: 250,
    width: 12,
    height: 100,
  });

  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameRef = useRef<number | undefined>(undefined);
  const trailRef = useRef<{ x: number; y: number; alpha: number }[]>([]);
  const lastFrameTime = useRef(performance.now());
  const frameCount = useRef(0);
  const wallHitAnimationRef = useRef(0);
  const paddleHitAnimationRef = useRef(0);

  useEffect(() => {
    gameStateRef.current = gameState;
    if (typeof window !== 'undefined' && gameState.score > gameState.highScore) {
      localStorage.setItem('pongHighScore', gameState.score.toString());
    }
  }, [gameState]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('pongHighScore');
      if (savedHighScore) {
        setGameState((prev) => ({ ...prev, highScore: parseInt(savedHighScore) }));
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const maxWidth = Math.min(containerRef.current.clientWidth - 40, 1000);
        const maxHeight = Math.min(window.innerHeight * 0.65, 750);
        const aspectRatio = 4 / 3;

        let width = maxWidth;
        let height = width / aspectRatio;

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        setDimensions({ width, height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const CANVAS_WIDTH = dimensions.width;
    const CANVAS_HEIGHT = dimensions.height;
    const WALL_X = CANVAS_WIDTH - 20;
    const scale = CANVAS_WIDTH / 800;

    ballRef.current.radius = 8 * scale;
    paddleRef.current.width = 12 * scale;
    paddleRef.current.height = 100 * scale;
    paddleRef.current.x = 50 * scale;

    const getDifficultyMultiplier = () => {
      switch (gameStateRef.current.difficulty) {
        case 'easy': return 0.7;
        case 'hard': return 1.4;
        default: return 1.0;
      }
    };

    const createParticles = (x: number, y: number, count: number, baseColor: string) => {
      const colors = [baseColor, '#60a5fa', '#34d399', '#fbbf24', '#f472b6'];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 2 + Math.random() * 4;
        particlesRef.current.push({
          x,
          y,
          dx: Math.cos(angle) * speed,
          dy: Math.sin(angle) * speed - 1,
          life: 40 + Math.random() * 30,
          maxLife: 70,
          size: 2 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const addFloatingText = (x: number, y: number, text: string, color: string) => {
      floatingTextsRef.current.push({
        x,
        y,
        text,
        life: 60,
        maxLife: 60,
        color,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!gameStateRef.current.started) {
          setGameState((prev) => ({ ...prev, started: true }));
        } else {
          setGameState((prev) => ({ ...prev, paused: !prev.paused }));
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        resetGame();
      }
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchStartY.current === null) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;
      const paddle = paddleRef.current;
      const sensitivity = 1.5;

      paddle.y -= deltaY * sensitivity;
      paddle.y = Math.max(0, Math.min(CANVAS_HEIGHT - paddle.height, paddle.y));

      touchStartY.current = touchY;
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd);

    const resetGame = () => {
      const multiplier = getDifficultyMultiplier();
      ballRef.current = {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        dx: 4 * scale * multiplier,
        dy: 4 * scale * multiplier,
        radius: 8 * scale,
      };
      paddleRef.current.y = CANVAS_HEIGHT / 2 - paddleRef.current.height / 2;
      particlesRef.current = [];
      trailRef.current = [];
      floatingTextsRef.current = [];
      wallHitAnimationRef.current = 0;
      paddleHitAnimationRef.current = 0;
      setGameState((prev) => ({
        ...prev,
        score: 0,
        combo: 0,
        gameOver: false,
        paused: false,
        started: false,
      }));
    };

    const draw = () => {
      // Background with animated gradient
      const time = Date.now() / 1000;
      const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, `hsl(${220 + Math.sin(time * 0.5) * 10}, 45%, 15%)`);
      gradient.addColorStop(1, '#1e293b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Animated grid pattern
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 + Math.sin(time) * 0.05})`;
      ctx.lineWidth = 1;
      const gridSize = 30 * scale;
      for (let i = 0; i < CANVAS_WIDTH; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      // Center line with pulse effect
      ctx.strokeStyle = `rgba(59, 130, 246, ${0.6 + Math.sin(time * 2) * 0.4})`;
      ctx.shadowBlur = 15 + Math.sin(time * 2) * 5;
      ctx.shadowColor = '#3b82f6';
      ctx.setLineDash([10 * scale, 10 * scale]);
      ctx.lineWidth = 2 + Math.sin(time * 3) * 0.5;
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Wall with animated glow and hit effect
      const wallPulse = Math.max(0, wallHitAnimationRef.current);
      const wallGradient = ctx.createLinearGradient(WALL_X - 30, 0, WALL_X + 30, 0);
      wallGradient.addColorStop(0, `rgba(16, 185, 129, ${0.1 + wallPulse * 0.3})`);
      wallGradient.addColorStop(0.5, `rgba(16, 185, 129, ${1 + wallPulse})`);
      wallGradient.addColorStop(1, `rgba(16, 185, 129, ${0.1 + wallPulse * 0.3})`);
      ctx.fillStyle = wallGradient;
      ctx.shadowBlur = 25 + wallPulse * 30;
      ctx.shadowColor = '#10b981';
      ctx.fillRect(WALL_X, 0, 20, CANVAS_HEIGHT);
      ctx.shadowBlur = 0;

      if (wallHitAnimationRef.current > 0) {
        wallHitAnimationRef.current -= 0.05;
      }

      // Ball trail with rainbow colors
      trailRef.current.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, ballRef.current.radius * point.alpha * 0.8, 0, Math.PI * 2);
        const hue = (index * 30 + time * 50) % 360;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${point.alpha * 0.4})`;
        ctx.fill();
      });

      // Paddle with glow and hit effect
      const paddlePulse = Math.max(0, paddleHitAnimationRef.current);
      const paddleGradient = ctx.createLinearGradient(
        paddleRef.current.x,
        paddleRef.current.y,
        paddleRef.current.x,
        paddleRef.current.y + paddleRef.current.height
      );
      paddleGradient.addColorStop(0, `rgba(96, 165, 250, ${1 + paddlePulse})`);
      paddleGradient.addColorStop(0.5, `rgba(59, 130, 246, ${1 + paddlePulse})`);
      paddleGradient.addColorStop(1, `rgba(37, 99, 235, ${1 + paddlePulse})`);
      ctx.fillStyle = paddleGradient;
      ctx.shadowBlur = 20 + paddlePulse * 20;
      ctx.shadowColor = '#3b82f6';

      // Rounded paddle
      const px = paddleRef.current.x;
      const py = paddleRef.current.y;
      const pw = paddleRef.current.width;
      const ph = paddleRef.current.height;
      const radius = pw / 2;

      ctx.beginPath();
      ctx.moveTo(px + radius, py);
      ctx.lineTo(px + pw - radius, py);
      ctx.quadraticCurveTo(px + pw, py, px + pw, py + radius);
      ctx.lineTo(px + pw, py + ph - radius);
      ctx.quadraticCurveTo(px + pw, py + ph, px + pw - radius, py + ph);
      ctx.lineTo(px + radius, py + ph);
      ctx.quadraticCurveTo(px, py + ph, px, py + ph - radius);
      ctx.lineTo(px, py + radius);
      ctx.quadraticCurveTo(px, py, px + radius, py);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      if (paddleHitAnimationRef.current > 0) {
        paddleHitAnimationRef.current -= 0.05;
      }

      // Ball with dynamic glow
      ctx.beginPath();
      ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
      const ballGradient = ctx.createRadialGradient(
        ballRef.current.x - ballRef.current.radius * 0.3,
        ballRef.current.y - ballRef.current.radius * 0.3,
        0,
        ballRef.current.x,
        ballRef.current.y,
        ballRef.current.radius * 1.5
      );
      ballGradient.addColorStop(0, '#ffffff');
      ballGradient.addColorStop(0.5, `hsl(${(time * 100) % 360}, 80%, 70%)`);
      ballGradient.addColorStop(1, `hsl(${(time * 100 + 60) % 360}, 70%, 50%)`);
      ctx.fillStyle = ballGradient;
      ctx.shadowBlur = 25;
      ctx.shadowColor = `hsl(${(time * 100) % 360}, 80%, 60%)`;
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;

      // Particles with rotation and varied colors
      particlesRef.current.forEach((particle) => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(') || `rgba(59, 130, 246, ${alpha})`;

        // Draw as small squares for variety
        const halfSize = particle.size / 2;
        ctx.fillRect(-halfSize, -halfSize, particle.size, particle.size);
        ctx.restore();
      });

      // Floating text
      floatingTextsRef.current.forEach((text) => {
        const alpha = text.life / text.maxLife;
        ctx.font = `bold ${20 * scale}px 'Arial', sans-serif`;
        ctx.fillStyle = text.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.shadowBlur = 10;
        ctx.shadowColor = text.color;
        ctx.textAlign = 'center';
        ctx.fillText(text.text, text.x, text.y);
        ctx.shadowBlur = 0;
      });

      // Score HUD with glow
      const fontSize = Math.max(28, 36 * scale);
      ctx.font = `bold ${fontSize}px 'Arial', sans-serif`;
      ctx.textAlign = 'left';

      // Score
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#3b82f6';
      ctx.fillText(`${gameStateRef.current.score}`, 20 * scale, 45 * scale);

      // Combo indicator
      if (gameStateRef.current.combo > 1) {
        ctx.font = `bold ${fontSize * 0.7}px 'Arial', sans-serif`;
        const comboAlpha = Math.min(1, gameStateRef.current.combo / 5);
        ctx.fillStyle = `rgba(251, 191, 36, ${comboAlpha})`;
        ctx.shadowColor = '#fbbf24';
        ctx.fillText(`x${gameStateRef.current.combo} COMBO!`, 20 * scale, 80 * scale);
      }

      // Speed meter
      const speed = Math.sqrt(ballRef.current.dx ** 2 + ballRef.current.dy ** 2);
      const baseSpeed = 4 * scale * getDifficultyMultiplier();
      const speedRatio = Math.min(2, speed / baseSpeed);

      ctx.font = `${fontSize * 0.5}px 'Arial', sans-serif`;
      ctx.fillStyle = '#94a3b8';
      ctx.shadowBlur = 5;
      ctx.fillText('SPEED', CANVAS_WIDTH - 120 * scale, 30 * scale);

      // Speed bar
      const barWidth = 100 * scale;
      const barHeight = 8 * scale;
      const barX = CANVAS_WIDTH - 120 * scale;
      const barY = 40 * scale;

      ctx.fillStyle = 'rgba(51, 65, 85, 0.5)';
      ctx.fillRect(barX, barY, barWidth, barHeight);

      const speedGradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
      speedGradient.addColorStop(0, '#10b981');
      speedGradient.addColorStop(0.5, '#fbbf24');
      speedGradient.addColorStop(1, '#ef4444');
      ctx.fillStyle = speedGradient;
      ctx.fillRect(barX, barY, barWidth * Math.min(1, speedRatio / 2), barHeight);
      ctx.shadowBlur = 0;

      // FPS Counter
      ctx.font = `${fontSize * 0.4}px 'Arial', sans-serif`;
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(gameStateRef.current.fps)} FPS`, CANVAS_WIDTH - 10 * scale, CANVAS_HEIGHT - 10 * scale);

      // Start screen
      if (!gameStateRef.current.started) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.font = `bold ${Math.max(48, 80 * scale)}px 'Arial', sans-serif`;
        const titleGradient = ctx.createLinearGradient(CANVAS_WIDTH / 2 - 100, 0, CANVAS_WIDTH / 2 + 100, 0);
        titleGradient.addColorStop(0, '#3b82f6');
        titleGradient.addColorStop(0.5, '#06b6d4');
        titleGradient.addColorStop(1, '#3b82f6');
        ctx.fillStyle = titleGradient;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#3b82f6';
        ctx.fillText('PONG', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 100 * scale);

        // Difficulty selection
        ctx.font = `${Math.max(14, 18 * scale)}px 'Arial', sans-serif`;
        ctx.fillStyle = '#94a3b8';
        ctx.shadowBlur = 5;
        ctx.fillText('DIFFICULTY', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30 * scale);

        const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
        difficulties.forEach((diff, index) => {
          const selected = gameStateRef.current.difficulty === diff;
          ctx.font = `${selected ? 'bold' : ''} ${Math.max(16, 22 * scale)}px 'Arial', sans-serif`;
          ctx.fillStyle = selected ? '#3b82f6' : '#64748b';
          ctx.shadowBlur = selected ? 15 : 0;
          ctx.shadowColor = '#3b82f6';
          ctx.fillText(diff.toUpperCase(), CANVAS_WIDTH / 2 + (index - 1) * 120 * scale, CANVAS_HEIGHT / 2 + 10 * scale);
        });

        ctx.font = `${Math.max(14, 20 * scale)}px 'Arial', sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fillText('Press SPACE to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70 * scale);
        ctx.fillText('Tap to play on mobile', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 100 * scale);
        ctx.shadowBlur = 0;
      }

      // Game over screen
      if (gameStateRef.current.gameOver) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.97)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.font = `bold ${Math.max(42, 56 * scale)}px 'Arial', sans-serif`;
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#ef4444';
        ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 90 * scale);

        ctx.font = `bold ${Math.max(24, 32 * scale)}px 'Arial', sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#3b82f6';
        ctx.fillText(`Score: ${gameStateRef.current.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20 * scale);

        if (gameStateRef.current.maxCombo > 1) {
          ctx.font = `${Math.max(16, 20 * scale)}px 'Arial', sans-serif`;
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#fbbf24';
          ctx.fillText(`Max Combo: x${gameStateRef.current.maxCombo}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 15 * scale);
        }

        if (gameStateRef.current.score === gameStateRef.current.highScore && gameStateRef.current.score > 0) {
          ctx.font = `bold ${Math.max(18, 24 * scale)}px 'Arial', sans-serif`;
          ctx.fillStyle = '#fbbf24';
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#fbbf24';
          ctx.fillText('🏆 NEW HIGH SCORE! 🏆', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 55 * scale);
        }

        ctx.font = `${Math.max(14, 18 * scale)}px 'Arial', sans-serif`;
        ctx.fillStyle = '#94a3b8';
        ctx.shadowBlur = 5;
        ctx.fillText('Press R to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 110 * scale);
        ctx.shadowBlur = 0;
      } else if (gameStateRef.current.paused) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.font = `bold ${Math.max(42, 56 * scale)}px 'Arial', sans-serif`;
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#fbbf24';
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        ctx.font = `${Math.max(16, 22 * scale)}px 'Arial', sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.fillText('Press SPACE to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60 * scale);
        ctx.shadowBlur = 0;
      }

      ctx.textAlign = 'left';
    };

    const update = () => {
      if (gameStateRef.current.gameOver || gameStateRef.current.paused || !gameStateRef.current.started)
        return;

      const ball = ballRef.current;
      const paddle = paddleRef.current;
      const PADDLE_SPEED = 7 * scale;

      // Move paddle
      if ((keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) && paddle.y > 0) {
        paddle.y -= PADDLE_SPEED;
      }
      if ((keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) && paddle.y < CANVAS_HEIGHT - paddle.height) {
        paddle.y += PADDLE_SPEED;
      }

      // Move ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Trail
      trailRef.current.push({ x: ball.x, y: ball.y, alpha: 1 });
      if (trailRef.current.length > 15) {
        trailRef.current.shift();
      }
      trailRef.current.forEach((point, index) => {
        point.alpha = index / trailRef.current.length;
      });

      // Wall collision (top/bottom)
      if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= CANVAS_HEIGHT) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius <= 0 ? ball.radius : CANVAS_HEIGHT - ball.radius;
        createParticles(ball.x, ball.y, 10, '#3b82f6');
      }

      // Wall collision (right)
      if (ball.x + ball.radius >= WALL_X) {
        ball.dx = -ball.dx;
        ball.x = WALL_X - ball.radius;
        createParticles(ball.x, ball.y, 20, '#10b981');
        wallHitAnimationRef.current = 1;

        const newScore = gameStateRef.current.score + 1;
        const newCombo = gameStateRef.current.combo + 1;

        setGameState((prev) => ({
          ...prev,
          score: newScore,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          highScore: Math.max(prev.highScore, newScore),
        }));

        if (newCombo % 5 === 0) {
          addFloatingText(WALL_X - 50, CANVAS_HEIGHT / 2, `${newCombo}X COMBO!`, '#fbbf24');
        }

        ball.dx *= 1.025;
        ball.dy *= 1.025;
      }

      // Paddle collision
      if (
        ball.x - ball.radius <= paddle.x + paddle.width &&
        ball.x + ball.radius >= paddle.x &&
        ball.y >= paddle.y &&
        ball.y <= paddle.y + paddle.height
      ) {
        ball.dx = -ball.dx;
        ball.x = paddle.x + paddle.width + ball.radius;
        createParticles(ball.x, ball.y, 15, '#3b82f6');
        paddleHitAnimationRef.current = 1;

        const hitPos = (ball.y - paddle.y) / paddle.height;
        const angle = ((hitPos - 0.5) * Math.PI) / 2.5;
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = Math.abs(ball.dx);
        ball.dy = Math.sin(angle) * speed;
      }

      // Update particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        particle.life -= 1;
        particle.dy += 0.15;
        particle.rotation += particle.rotationSpeed;
        return particle.life > 0;
      });

      // Update floating text
      floatingTextsRef.current = floatingTextsRef.current.filter((text) => {
        text.y -= 1;
        text.life -= 1;
        return text.life > 0;
      });

      // Game over
      if (ball.x - ball.radius <= 0) {
        createParticles(ball.x, ball.y, 30, '#ef4444');
        setGameState((prev) => ({ ...prev, gameOver: true, combo: 0 }));
      }
    };

    const gameLoop = () => {
      // FPS calculation
      const now = performance.now();
      frameCount.current++;
      if (now >= lastFrameTime.current + 1000) {
        setGameState((prev) => ({ ...prev, fps: frameCount.current }));
        frameCount.current = 0;
        lastFrameTime.current = now;
      }

      update();
      draw();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dimensions]);

  const changeDifficulty = (difficulty: Difficulty) => {
    if (!gameState.started) {
      setGameState((prev) => ({ ...prev, difficulty }));
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen gap-8 md:gap-10 p-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative text-center space-y-3 animate-fade-in z-10">
        <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-2xl animate-glow">
          NEON PONG
        </h1>
        <p className="text-base md:text-lg text-cyan-300 font-semibold tracking-wide">Single Player Challenge</p>
      </div>

      <div className="relative group z-10">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-2xl opacity-50 animate-pulse" style={{ animationDuration: '3s' }}></div>
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className="relative rounded-2xl shadow-2xl border-2 border-blue-400/30 cursor-pointer"
          onClick={() => {
            if (!gameState.started) {
              setGameState((prev) => ({ ...prev, started: true }));
            }
          }}
        />
      </div>

      {!gameState.started && (
        <div className="flex gap-4 z-10 animate-fade-in">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => changeDifficulty(diff)}
              className={`px-6 py-3 rounded-xl font-bold uppercase transition-all duration-300 ${
                gameState.difficulty === diff
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 scale-110'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl w-full px-4 z-10">
        <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-blue-400/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30">
          <div className="text-blue-300 font-bold mb-2 text-sm md:text-base uppercase tracking-wide">Score</div>
          <div className="text-white text-3xl md:text-4xl font-black">{gameState.score}</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/40 to-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/30">
          <div className="text-yellow-300 font-bold mb-2 text-sm md:text-base uppercase tracking-wide">Best</div>
          <div className="text-white text-3xl md:text-4xl font-black">{gameState.highScore}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
          <div className="text-purple-300 font-bold mb-2 text-sm md:text-base uppercase tracking-wide">Combo</div>
          <div className="text-white text-3xl md:text-4xl font-black">x{gameState.combo}</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/40 to-slate-900/40 backdrop-blur-md rounded-2xl p-5 border border-cyan-400/30 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30">
          <div className="text-cyan-300 font-bold mb-2 text-sm md:text-base uppercase tracking-wide">Max Combo</div>
          <div className="text-white text-3xl md:text-4xl font-black">x{gameState.maxCombo}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full px-4 z-10">
        <div className="bg-slate-900/50 backdrop-blur-lg rounded-xl p-5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
          <div className="text-emerald-400 font-bold mb-3 text-base md:text-lg flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <span>Controls</span>
          </div>
          <div className="text-slate-300 text-sm md:text-base space-y-2">
            <p className="flex justify-between"><span>Move:</span> <span className="text-white font-semibold">↑/↓ or W/S</span></p>
            <p className="flex justify-between"><span>Pause:</span> <span className="text-white font-semibold">SPACE</span></p>
            <p className="flex justify-between"><span>Restart:</span> <span className="text-white font-semibold">R</span></p>
            <p className="flex justify-between"><span>Mobile:</span> <span className="text-white font-semibold">Touch & Drag</span></p>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-lg rounded-xl p-5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
          <div className="text-cyan-400 font-bold mb-3 text-base md:text-lg flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span>Tips</span>
          </div>
          <div className="text-slate-300 text-sm md:text-base space-y-1">
            <p>• Hit the green wall to score</p>
            <p>• Ball speeds up each hit</p>
            <p>• Build combos for bonus points</p>
            <p>• Harder difficulty = faster ball</p>
          </div>
        </div>
      </div>

      <div className="text-center text-slate-500 text-xs md:text-sm z-10">
        <p className="font-semibold">Built with Next.js 15 & TypeScript • Canvas API • Tailwind CSS</p>
      </div>
    </div>
  );
}
