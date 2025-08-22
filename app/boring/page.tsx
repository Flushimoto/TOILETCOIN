'use client';

import { useEffect, useRef, useState } from 'react';

type GameState = 'title' | 'playing' | 'gameover';

export default function Boring() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [state, setState] = useState<GameState>('title');

  // persistent best score
  useEffect(() => {
    const b = Number(localStorage.getItem('toiletcoin_best') || '0');
    setBest(b);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Logical game size (we scale it with CSS to fit screen)
    const W = 480;
    const H = 720;
    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    // Game objects
    let running = true;
    let tLast = performance.now();

    // player (toilet) — pixel-ish look
    const player = {
      x: W / 2,
      y: H - 80,
      w: 64,
      h: 42,
      speed: 420, // px/s
    };

    // input
    let moveLeft = false;
    let moveRight = false;

    function keyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight = true;
      if (state === 'title' && (e.key === ' ' || e.key === 'Enter')) start();
      if (state === 'gameover' && (e.key === ' ' || e.key === 'Enter')) start();
    }
    function keyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight = false;
    }
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // touch controls: left/right half
    function onTouch(e: TouchEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0]?.clientX ?? 0;
      const mid = rect.left + rect.width / 2;
      moveLeft = x < mid;
      moveRight = x >= mid;
    }
    function onTouchEnd() {
      moveLeft = false;
      moveRight = false;
    }
    canvas.addEventListener('touchstart', onTouch, { passive: true });
    canvas.addEventListener('touchmove', onTouch, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // game model
    type Coin = { x: number; y: number; r: number; vy: number };
    const coins: Coin[] = [];
    let spawnTimer = 0;
    let spawnEvery = 900; // ms
    let lives = 3;
    let _score = 0;

    function start() {
      setState('playing');
      // reset
      coins.length = 0;
      spawnTimer = 0;
      spawnEvery = 900;
      lives = 3;
      _score = 0;
      setScore(0);
      player.x = W / 2;
    }

    // helpers
    function clamp(v: number, a: number, b: number) {
      return Math.max(a, Math.min(b, v));
    }

    function aabbCircleCollide(px: number, py: number, pw: number, ph: number, cx: number, cy: number, cr: number) {
      // nearest point on rect to circle center
      const nx = clamp(cx, px, px + pw);
      const ny = clamp(cy, py, py + ph);
      const dx = cx - nx;
      const dy = cy - ny;
      return (dx * dx + dy * dy) <= cr * cr;
    }

    function spawnCoin() {
      const r = 12 + Math.floor(Math.random() * 10); // radius
      const x = r + Math.random() * (W - 2 * r);
      const y = -r - 10;
      // speed ramps with score
      const base = 140;
      const extra = Math.min(320, _score * 6);
      const vy = base + extra + Math.random() * 40;
      coins.push({ x, y, r, vy });
    }

    function update(dt: number) {
      // move player
      if (moveLeft) player.x -= player.speed * dt;
      if (moveRight) player.x += player.speed * dt;
      player.x = clamp(player.x, player.w / 2 + 8, W - player.w / 2 - 8);

      // spawn coins
      spawnTimer += dt * 1000;
      const minEvery = 300;
      const ramped = Math.max(minEvery, spawnEvery - Math.floor(_score * 6)); // faster with score
      while (spawnTimer >= ramped) {
        spawnTimer -= ramped;
        spawnCoin();
      }

      // update coins
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.y += c.vy * dt;

        // caught?
        if (aabbCircleCollide(player.x - player.w / 2, player.y - player.h / 2, player.w, player.h, c.x, c.y, c.r)) {
          coins.splice(i, 1);
          _score += 1;
          setScore(_score);
          // light shake
          shake = 6;
          continue;
        }
        // missed?
        if (c.y - c.r > H) {
          coins.splice(i, 1);
          lives -= 1;
          if (lives <= 0) {
            gameOver();
            return;
          }
        }
      }
    }

    // simple screen shake when catching
    let shake = 0;
    function draw() {
      // clear
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      // pixel bathroom background (tiles)
      const tileSize = 24;
      for (let y = 0; y < H; y += tileSize) {
        for (let x = 0; x < W; x += tileSize) {
          ctx.fillStyle = ((x / tileSize + y / tileSize) % 2 === 0) ? '#111' : '#0e0e0e';
          ctx.fillRect(x, y, tileSize, tileSize);
        }
      }

      // graffiti (lightly randomized, fixed positions)
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.font = '12px monospace';
      ctx.fillText('flush=truth', 24, 80);
      ctx.fillText('no roadmap, only toilets', 280, 52);
      ctx.fillText('degens wash hands?', 300, 680);

      // HUD
      ctx.fillStyle = '#fff';
      ctx.font = '16px monospace';
      ctx.fillText(`Score: ${_score}`, 16, 26);
      ctx.fillText(`Lives: ${'♥'.repeat(lives)}${' '.repeat(Math.max(0, 3 - lives))}`, 16, 48);

      // coins
      ctx.save();
      if (shake > 0) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
        shake *= 0.85;
        if (shake < 0.5) shake = 0;
      }
      coins.forEach((c) => {
        // coin body
        ctx.fillStyle = '#6b3f1d'; // shitcoin brown
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
        // highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(c.x - c.r * 0.3, c.y - c.r * 0.3, c.r * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        // tiny face
        ctx.fillStyle = '#000';
        ctx.fillRect(c.x - 4, c.y - 2, 2, 2);
        ctx.fillRect(c.x + 2, c.y - 2, 2, 2);
        ctx.fillRect(c.x - 3, c.y + 3, 6, 2);
      });
      ctx.restore();

      // toilet (player) — pixel style
      const px = player.x - player.w / 2;
      const py = player.y - player.h / 2;
      // bowl
      ctx.fillStyle = '#d9d9d9';
      ctx.fillRect(px + 6, py + 10, player.w - 12, player.h - 16);
      // rim
      ctx.fillStyle = '#f1f1f1';
      ctx.fillRect(px, py, player.w, 12);
      // lid line
      ctx.fillStyle = '#bdbdbd';
      ctx.fillRect(px + 4, py + 12, player.w - 8, 3);
      // base
      ctx.fillStyle = '#bcbcbc';
      ctx.fillRect(px + player.w / 2 - 8, py + player.h - 8, 16, 8);

      // title or game over overlays
      if (state !== 'playing') {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        if (state === 'title') {
          ctx.font = '28px monospace';
          ctx.fillText('FLUSH THE SHITCOINS', W / 2, H / 2 - 60);
          ctx.font = '14px monospace';
          ctx.fillText('Catch falling shitcoins to clean the chain.', W / 2, H / 2 - 26);
          ctx.fillText('Arrows / A D to move. Tap left/right on mobile.', W / 2, H / 2 - 6);
          ctx.fillText('Press SPACE or TAP to start', W / 2, H / 2 + 32);
        } else if (state === 'gameover') {
          ctx.font = '26px monospace';
          const lines = [
            'Uuupps… too many shitcoins coming our way.',
            'Damn, Pump.fun overflow.',
            'Chain clogged. Call a plumber.',
            'Overflown mempool — and actual pool.',
          ];
          ctx.fillText(lines[_score % lines.length], W / 2, H / 2 - 40);
          ctx.font = '16px monospace';
          ctx.fillText(`Score: ${_score}   Best: ${Math.max(best, _score)}`, W / 2, H / 2 - 10);
          ctx.fillText('Press SPACE or TAP to flush again', W / 2, H / 2 + 26);
        }
        ctx.textAlign = 'start';
      }
    }

    function gameOver() {
      setState('gameover');
      const newBest = Math.max(best, _score);
      setBest(newBest);
      localStorage.setItem('toiletcoin_best', String(newBest));
    }

    // Tap to start/restart
    function onPointerDown() {
      if (state === 'title' || state === 'gameover') start();
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    function loop(now: number) {
      if (!running) return;
      const dt = Math.min(0.033, (now - tLast) / 1000); // cap dt
      tLast = now;

      if (state === 'playing') update(dt);
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // CSS scale to fit screen
    const resize = () => {
      if (!wrap) return;
      wrap.style.display = 'grid';
      wrap.style.placeItems = 'center';
      wrap.style.width = '100vw';
      wrap.style.height = '100vh';
      // center canvas; CSS handles scaling
      canvas.style.width = 'min(96vw, 480px)';
      canvas.style.height = 'auto';
      // on tall phones, allow taller scale
      const vw = Math.min(window.innerWidth * 0.96, 480);
      const vh = window.innerHeight * 0.96;
      // if there’s more vertical room, scale up by height
      const scaleByHeight = vh / 720;
      const scaleByWidth = vw / 480;
      const scale = Math.min(Math.max(scaleByWidth, 0.6), Math.max(scaleByHeight, 0.6));
      canvas.style.width = `${480 * scale}px`;
      canvas.style.height = `${720 * scale}px`;
    };
    window.addEventListener('resize', resize);
    resize();

    // cleanup
    return () => {
      running = false;
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [best, state]);

  return (
    <div ref={wrapRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
