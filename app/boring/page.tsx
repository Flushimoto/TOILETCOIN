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
    const W = 480;
    const H = 720;
    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    // ---------- Assets ----------
    const imgTile = new Image();
    imgTile.src = '/game/tile.png';
    const imgToilet = new Image();
    imgToilet.src = '/game/toilet.png';
    const imgCoin = new Image();
    imgCoin.src = '/game/shitcoin.png';

    const sPlop = new Audio('/game/s_plop.wav');   // good catch
    const sFlush = new Audio('/game/s_flush.wav'); // level up burst
    const sMiss = new Audio('/game/s_miss.wav');   // missed coin

    // unlock sound by first user gesture
    let audioReady = false;
    const unlockAudio = () => {
      if (audioReady) return;
      // Play a silent frame to unlock
      sPlop.muted = true; sPlop.play().catch(() => {}); sPlop.pause(); sPlop.currentTime = 0; sPlop.muted = false;
      audioReady = true;
      canvas.removeEventListener('pointerdown', unlockAudio);
    };
    canvas.addEventListener('pointerdown', unlockAudio);

    // ---------- Game data ----------
    let running = true;
    let tLast = performance.now();

    const player = {
      x: W / 2,
      y: H - 80,
      w: 64,
      h: 42,
      speed: 420, // px/s
    };

    let moveLeft = false;
    let moveRight = false;

    function keyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight = true;
      if (state === 'title' && (e.key === ' ' || e.key === 'Enter')) start();
      if (state === 'gameover' && (e.key === ' ' || e.key === 'Enter')) start();
      if (e.key === 'Escape') window.history.back();
    }
    function keyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight = false;
    }
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // Touch controls: left/right half
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

    type Coin = { x: number; y: number; r: number; vy: number };
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string };
    type Popup = { x: number; y: number; text: string; life: number; max: number };

    const coins: Coin[] = [];
    const parts: Particle[] = [];
    const pops: Popup[] = [];

    let spawnTimer = 0;
    let spawnEvery = 900; // ms
    let lives = 3;
    let _score = 0;

    // combo mechanics
    let combo = 0;
    let mult = 1;

    function start() {
      setState('playing');
      coins.length = 0;
      parts.length = 0;
      pops.length = 0;
      spawnTimer = 0;
      spawnEvery = 900;
      lives = 3;
      _score = 0;
      combo = 0;
      mult = 1;
      setScore(0);
      player.x = W / 2;
    }

    function clamp(v: number, a: number, b: number) {
      return Math.max(a, Math.min(b, v));
    }

    function aabbCircleCollide(px: number, py: number, pw: number, ph: number, cx: number, cy: number, cr: number) {
      const nx = clamp(cx, px, px + pw);
      const ny = clamp(cy, py, py + ph);
      const dx = cx - nx;
      const dy = cy - ny;
      return (dx * dx + dy * dy) <= cr * cr;
    }

    function spawnCoin() {
      const r = 12 + Math.floor(Math.random() * 10);
      const x = r + Math.random() * (W - 2 * r);
      const y = -r - 10;
      const base = 140;
      const extra = Math.min(360, _score * 6);
      const vy = base + extra + Math.random() * 40;
      coins.push({ x, y, r, vy });
    }

    function addSplash(x: number, y: number, count = 8) {
      for (let i = 0; i < count; i++) {
        parts.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 140,
          vy: - (80 + Math.random() * 120),
          life: 0,
          max: 0.4 + Math.random() * 0.4,
          color: '#9ad6ff',
        });
      }
    }

    function addPopup(x: number, y: number, text: string) {
      pops.push({ x, y, text, life: 0, max: 0.6 });
    }

    // simple screen shake when catching
    let shake = 0;

    function update(dt: number) {
      // move player
      if (moveLeft) player.x -= player.speed * dt;
      if (moveRight) player.x += player.speed * dt;
      player.x = clamp(player.x, player.w / 2 + 8, W - player.w / 2 - 8);

      // spawn coins (ramp spawn rate)
      spawnTimer += dt * 1000;
      const minEvery = 260;
      const ramped = Math.max(minEvery, spawnEvery - Math.floor(_score * 6));
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
          // combo & score
          combo += 1;
          mult = 1 + Math.floor(combo / 5); // +1 every 5 streak
          const gain = 1 * mult;
          _score += gain;
          setScore(_score);
          // effects
          addSplash(c.x, player.y - 4, 8 + Math.floor(Math.random() * 4));
          addPopup(c.x, player.y - 20, mult > 1 ? `+${gain} x${mult}` : `+${gain}`);
          shake = Math.min(8, 4 + mult);
          try { sPlop.currentTime = 0; sPlop.play().catch(()=>{}); } catch {}
          // small level-up whoosh every new multiplier
          if (combo % 5 === 0) { try { sFlush.currentTime = 0; sFlush.play().catch(()=>{}); } catch {} }
          continue;
        }
        // missed?
        if (c.y - c.r > H) {
          coins.splice(i, 1);
          lives -= 1;
          combo = 0;
          mult = 1;
          try { sMiss.currentTime = 0; sMiss.play().catch(()=>{}); } catch {}
          if (lives <= 0) { gameOver(); return; }
        }
      }

      // particles
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 280 * dt; // gravity
        if (p.life >= p.max) parts.splice(i, 1);
      }

      // popups
      for (let i = pops.length - 1; i >= 0; i--) {
        const p = pops[i];
        p.life += dt;
        p.y -= 40 * dt;
        if (p.life >= p.max) pops.splice(i, 1);
      }
    }

    function drawBackground() {
      // tiled pixel background
      const tileSize = 24;
      for (let y = 0; y < H; y += tileSize) {
        for (let x = 0; x < W; x += tileSize) {
          // draw tile sprite if loaded, else fallback color
          if (imgTile.complete) {
            ctx.drawImage(imgTile, x, y);
          } else {
            ctx.fillStyle = ((x / tileSize + y / tileSize) % 2 === 0) ? '#111' : '#0e0e0e';
            ctx.fillRect(x, y, tileSize, tileSize);
          }
        }
      }
    }

    function draw(dt: number) {
      // clear
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      drawBackground();

      // graffiti
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.font = '12px monospace';
      ctx.fillText('flush=truth', 24, 80);
      ctx.fillText('no roadmap, only toilets', 280, 52);
      ctx.fillText('degens wash hands?', 300, 680);

      // HUD
      ctx.fillStyle = '#fff';
      ctx.font = '16px monospace';
      ctx.fillText(`Score: ${_score}`, 16, 26);
      ctx.fillText(`Lives: ${'♥'.repeat(lives)}`, 16, 48);
      if (mult > 1) {
        ctx.fillStyle = '#ffd24a';
        ctx.fillText(`Combo x${mult}`, 360, 26);
      }

      // coins
      ctx.save();
      if (shake > 0) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
        shake *= 0.85;
        if (shake < 0.5) shake = 0;
      }
      coins.forEach((c) => {
        if (imgCoin.complete) {
          const s = c.r * 2; // scale sprite to radius
          ctx.drawImage(imgCoin, c.x - s / 2, c.y - s / 2, s, s);
        } else {
          ctx.fillStyle = '#6b3f1d';
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // particles
      parts.forEach(p => {
        const a = 1 - p.life / p.max;
        ctx.fillStyle = `rgba(154,214,255,${a.toFixed(2)})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      });

      // popups
      ctx.textAlign = 'center';
      pops.forEach(p => {
        const a = 1 - p.life / p.max;
        ctx.fillStyle = `rgba(255,210,74,${a.toFixed(2)})`;
        ctx.font = '14px monospace';
        ctx.fillText(p.text, p.x, p.y);
      });
      ctx.textAlign = 'start';

      // toilet (player)
      const px = player.x - player.w / 2;
      const py = player.y - player.h / 2;
      if (imgToilet.complete) {
        ctx.drawImage(imgToilet, px, py);
      } else {
        // fallback pixel toilet
        ctx.fillStyle = '#d9d9d9';
        ctx.fillRect(px + 6, py + 10, player.w - 12, player.h - 16);
        ctx.fillStyle = '#f1f1f1';
        ctx.fillRect(px, py, player.w, 12);
        ctx.fillStyle = '#bdbdbd';
        ctx.fillRect(px + 4, py + 12, player.w - 8, 3);
        ctx.fillStyle = '#bcbcbc';
        ctx.fillRect(px + player.w / 2 - 8, py + player.h - 8, 16, 8);
      }

      // overlays
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
          ctx.fillText(lines[_score % lines.length], W / 2, H / 2 - 44);
          ctx.font = '16px monospace';
          ctx.fillText(`Score: ${_score}   Best: ${Math.max(best, _score)}`, W / 2, H / 2 - 12);
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

    function onPointerDown() {
      if (state === 'title' || state === 'gameover') start();
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    function loop(now: number) {
      if (!running) return;
      const dt = Math.min(0.033, (now - tLast) / 1000);
      tLast = now;

      if (state === 'playing') update(dt);
      draw(dt);
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
      const vw = Math.min(window.innerWidth * 0.96, 520);
      const vh = window.innerHeight * 0.96;
      const scaleW = vw / 480;
      const scaleH = vh / 720;
      const scale = Math.max(0.6, Math.min(scaleW, scaleH));
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
      canvas.removeEventListener('pointerdown', unlockAudio);
    };
  }, [best, state]);

  return (
    <div ref={wrapRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}
