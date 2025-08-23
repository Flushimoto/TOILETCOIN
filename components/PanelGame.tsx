'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Toiletcoin Mini-game — Panel version (Canvas + WebAudio, no external assets)
 * - Opens inside Overlay panel (same as Story/Wipepaper)
 * - Easier difficulty, 5 lives
 * - Water-drop catch, whoosh combo, thud miss via WebAudio
 * - Guaranteed pixel tile background
 * - Safer title/gameover text layout
 */

type GameState = 'title' | 'playing' | 'gameover';

export default function PanelGame() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [best, setBest] = useState(0);

  useEffect(() => {
    const b = Number(localStorage.getItem('toiletcoin_best') || '0');
    setBest(b);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const W = 480;
    const H = 720;
    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;

    // ------ WebAudio (no asset files needed) ------
    let audioCtx: AudioContext | null = null;
    function ensureAudio() {
      if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    function playDrop() { // water drop
      ensureAudio();
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(420, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.14);
      g.gain.setValueAtTime(0.18, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      o.connect(g).connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.2);
    }

    function playFlush() { // soft whoosh
      ensureAudio();
      if (!audioCtx) return;
      const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.35, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t = i / audioCtx.sampleRate;
        const n = (Math.random() * 2 - 1) * Math.exp(-4 * t);
        data[i] = n * 0.35;
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(audioCtx.destination);
      src.start();
    }

    function playMiss() { // thud/buzzer
      ensureAudio();
      if (!audioCtx) return;
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'square';
      o.frequency.setValueAtTime(160, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(90, audioCtx.currentTime + 0.22);
      g.gain.setValueAtTime(0.12, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.24);
      o.connect(g).connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.25);
    }

    // ------ Game state ------
    let state: GameState = 'title';
    let running = true;
    let tLast = performance.now();

    const player = { x: W / 2, y: H - 82, w: 74, h: 48, speed: 420 }; // bigger catch box
    let moveLeft = false;
    let moveRight = false;

    type Coin = { x: number; y: number; r: number; vy: number };
    type Particle = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string };
    type Popup = { x: number; y: number; text: string; life: number; max: number };

    const coins: Coin[] = [];
    const parts: Particle[] = [];
    const pops: Popup[] = [];

    let spawnTimer = 0;
    let spawnEvery = 1100; // easier start
    let lives = 5;         // more lives
    let score = 0;

    let combo = 0;
    let mult = 1;
    let shake = 0;

    function start() {
      state = 'playing';
      coins.length = 0; parts.length = 0; pops.length = 0;
      spawnTimer = 0; spawnEvery = 1100;
      lives = 5; score = 0; combo = 0; mult = 1; shake = 0;
      player.x = W / 2;
      draw(0); // immediate paint
    }

    function gameOver() {
      state = 'gameover';
      const newBest = Math.max(best, score);
      setBest(newBest);
      localStorage.setItem('toiletcoin_best', String(newBest));
    }

    // Controls
    function keyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveLeft = true;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRight = true;
      if (state !== 'playing' && (e.key === ' ' || e.key === 'Enter')) start();
    }
    function keyUp(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') moveLeft = false;
      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') moveRight = false;
    }
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    function onPointerDown() {
      if (state !== 'playing') start();
      // also unlock audio on first gesture
      ensureAudio();
    }
    canvas.addEventListener('pointerdown', onPointerDown);

    // Touch: left/right halves
    function onTouch(e: TouchEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0]?.clientX ?? 0;
      const mid = rect.left + rect.width / 2;
      moveLeft = x < mid; moveRight = x >= mid;
    }
    function onTouchEnd() { moveLeft = false; moveRight = false; }
    canvas.addEventListener('touchstart', onTouch, { passive: true });
    canvas.addEventListener('touchmove', onTouch, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // Helpers
    const clamp = (v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
    function aabbCircle(px:number,py:number,pw:number,ph:number,cx:number,cy:number,cr:number){
      const nx = clamp(cx, px, px + pw), ny = clamp(cy, py, py + ph);
      const dx = cx - nx, dy = cy - ny;
      return (dx*dx + dy*dy) <= cr*cr;
    }
    function spawnCoin() {
      const r = 13 + Math.floor(Math.random() * 9);
      const x = r + Math.random() * (W - 2 * r);
      const y = -r - 10;
      // slower base; gentle ramp
      const base = 110;
      const extra = Math.min(260, score * 4);
      const vy = base + extra + Math.random() * 30;
      coins.push({ x, y, r, vy });
    }
    function addSplash(x:number,y:number,count=10){
      for (let i=0;i<count;i++){
        parts.push({ x, y, vx:(Math.random()-0.5)*120, vy:-(70+Math.random()*110), life:0, max:0.5+Math.random()*0.4, color:'#9ad6ff' });
      }
    }
    function addPopup(x:number,y:number,text:string){ pops.push({x,y,text,life:0,max:0.6}); }

    // Update/draw
    function update(dt:number){
      if (state !== 'playing') return;

      // move with easing
      const accel = player.speed * 2.2;
      if (moveLeft) player.x -= accel * dt;
      if (moveRight) player.x += accel * dt;
      player.x = clamp(player.x, player.w/2 + 8, W - player.w/2 - 8);

      // spawn logic
      spawnTimer += dt * 1000;
      const minEvery = 360; // minimum time between spawns (easier)
      const ramped = Math.max(minEvery, spawnEvery - Math.floor(score * 5));
      while (spawnTimer >= ramped) { spawnTimer -= ramped; spawnCoin(); }

      // coins
      for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.y += c.vy * dt;

        // catch?
        if (aabbCircle(player.x - player.w/2, player.y - player.h/2, player.w, player.h, c.x, c.y, c.r)){
          coins.splice(i, 1);
          combo += 1;
          mult = 1 + Math.floor(combo / 5);
          const gain = 1 * mult;
          score += gain;
          addSplash(c.x, player.y - 6, 10 + Math.floor(Math.random() * 4));
          addPopup(c.x, player.y - 24, mult > 1 ? `+${gain} x${mult}` : `+${gain}`);
          shake = Math.min(8, 4 + mult);
          playDrop();
          if (combo % 5 === 0) playFlush();
          continue;
        }
        // missed?
        if (c.y - c.r > H){
          coins.splice(i, 1);
          combo = 0; mult = 1; lives -= 1;
          playMiss();
          if (lives <= 0){ gameOver(); return; }
        }
      }

      // particles
      for (let i=parts.length-1;i>=0;i--){
        const p = parts[i];
        p.life += dt; p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 280*dt;
        if (p.life >= p.max) parts.splice(i,1);
      }
      // popups
      for (let i=pops.length-1;i>=0;i--){
        const p = pops[i];
        p.life += dt; p.y -= 42*dt;
        if (p.life >= p.max) pops.splice(i,1);
      }
    }

    function drawBackground(){
      // guaranteed checker tiles
      const tile = 24;
      for (let y=0;y<H;y+=tile){
        for (let x=0;x<W;x+=tile){
          if (((x/tile + y/tile) | 0) % 2 === 0) ctx.fillStyle = '#111';
          else ctx.fillStyle = '#0e0e0e';
          ctx.fillRect(x,y,tile,tile);
        }
      }
    }

    function drawToilet(px:number, py:number, w:number, h:number){
      // Better pixel toilet fallback
      // tank
      ctx.fillStyle = '#bfc3c8';
      ctx.fillRect(px + w*0.15, py + h*0.02, w*0.7, h*0.2);
      // bowl body
      ctx.fillStyle = '#e6e7e9';
      ctx.fillRect(px + w*0.08, py + h*0.22, w*0.84, h*0.42);
      // rim
      ctx.fillStyle = '#fafbfc';
      ctx.fillRect(px, py + h*0.16, w, h*0.08);
      // seat line
      ctx.fillStyle = '#c8cbd0';
      ctx.fillRect(px + w*0.06, py + h*0.26, w*0.88, h*0.03);
      // base
      ctx.fillStyle = '#cfd2d6';
      ctx.fillRect(px + w*0.42, py + h*0.64, w*0.16, h*0.2);
    }

    function draw(){
      // clear
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0,0,W,H);

      drawBackground();

      // graffiti (subtle)
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.font = '12px monospace';
      ctx.fillText('flush=truth', 24, 80);
      ctx.fillText('no roadmap, only toilets', 280, 52);
      ctx.fillText('wash hands (maybe)', 300, 680);

      // HUD
      ctx.fillStyle = '#fff';
      ctx.font = '16px monospace';
      ctx.fillText(`Score: ${score}`, 16, 24);
      ctx.fillText(`Lives: ${'♥'.repeat(lives)}`, 16, 46);
      if (mult > 1) { ctx.fillStyle = '#ffd24a'; ctx.fillText(`Combo x${mult}`, 360, 24); }

      // coins
      ctx.save();
      if (shake > 0){
        ctx.translate((Math.random()-0.5)*shake, (Math.random()-0.5)*shake);
        shake *= 0.86; if (shake < 0.4) shake = 0;
      }
      for (const c of coins){
        ctx.fillStyle = '#6b3f1d';
        ctx.beginPath(); ctx.arc(c.x,c.y,c.r,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(c.x-2, c.y-2, 2, 2);
      }

      // particles
      for (const p of parts){
        const a = 1 - p.life / p.max;
        ctx.fillStyle = `rgba(154,214,255,${a.toFixed(2)})`;
        ctx.fillRect(p.x, p.y, 3, 3);
      }

      // popups
      ctx.textAlign = 'center';
      for (const p of pops){
        const a = 1 - p.life / p.max;
        ctx.fillStyle = `rgba(255,210,74,${a.toFixed(2)})`;
        ctx.font = '14px monospace';
        ctx.fillText(p.text, p.x, p.y);
      }
      ctx.textAlign = 'start';

      // toilet
      const px = player.x - player.w/2;
      const py = player.y - player.h/2;
      drawToilet(px, py, player.w, player.h);

      // overlays
      if (state !== 'playing'){
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0,0,W,H);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        if (state === 'title'){
          ctx.font = '24px monospace';
          ctx.fillText('FLUSH THE SHITCOINS', W/2, H/2 - 70);
          ctx.font = '14px monospace';
          ctx.fillText('Catch falling shitcoins to clean the chain.', W/2, H/2 - 34);
          ctx.fillText('Arrows / A D to move. Tap left/right on mobile.', W/2, H/2 - 12);
          ctx.fillText('Press SPACE or TAP to start', W/2, H/2 + 18);
        } else if (state === 'gameover'){
          ctx.font = '18px monospace';
          const lines = [
            'Uuupps… too many shitcoins coming our way.',
            'Damn, Pump.fun overflow.',
            'Chain clogged. Call a plumber.',
          ];
          ctx.fillText(lines[score % lines.length], W/2, H/2 - 36);
          ctx.fillText(`Score: ${score}   Best: ${Math.max(best, score)}`, W/2, H/2 - 8);
          ctx.fillText('Press SPACE or TAP to flush again', W/2, H/2 + 20);
        }
        ctx.textAlign = 'start';
      }
    }

    function loop(now:number){
      if (!running) return;
      const dt = Math.min(0.033, (now - tLast) / 1000);
      tLast = now;
      update(dt);
      draw();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // scale canvas to panel
    function resize() {
      const wrap = wrapRef.current!;
      wrap.style.display = 'grid';
      wrap.style.placeItems = 'center';
      wrap.style.width = '100%';
      wrap.style.height = '100%';
      const rect = wrap.getBoundingClientRect();
      const scaleW = rect.width / W;
      const scaleH = rect.height / H;
      const scale = Math.max(0.6, Math.min(scaleW, scaleH));
      canvas.style.width = `${W * scale}px`;
      canvas.style.height = `${H * scale}px`;
    }
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current!);
    resize();

    return () => {
      running = false;
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('touchstart', onTouch);
      canvas.removeEventListener('touchmove', onTouch);
      canvas.removeEventListener('touchend', onTouchEnd);
      ro.disconnect();
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close().catch(()=>{});
    };
  }, [best]);

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '70vh', minHeight: 520 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
