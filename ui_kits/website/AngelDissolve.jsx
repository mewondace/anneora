// Anneora — AngelDissolve. A scroll-pinned canvas: an angel image that
// disintegrates into drifting ash as you scroll through the section.
// Pixel-sampled particle field with depth parallax (reads volumetric / 3D).
// Drop your own angel render in; it persists in localStorage.
//
// Mechanics: the outer wrapper is tall; an inner sticky stage holds the
// canvas. Scroll progress across the wrapper (0..1) drives the dissolve.

const ANGEL_KEY = 'anneora:img:angel';

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function AngelDissolve() {
  const wrapRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const [hasAngel, setHasAngel] = React.useState(false);
  const [over, setOver] = React.useState(false);
  const fileRef = React.useRef(null);

  // mutable engine state (not React state — avoids re-renders per frame)
  const eng = React.useRef({
    particles: [], imgW: 0, imgH: 0, bitmap: null,
    progress: 0, target: 0, mouse: { x: 0, y: 0 }, raf: 0, inView: true,
  });

  // ---- build particle field from an image ----------------------------
  const buildField = (img) => {
    const e = eng.current;
    const stage = stageRef.current;
    if (!stage) return;
    const vh = stage.clientHeight, vw = stage.clientWidth;
    // fill nearly the full stage height, bottom-anchored. keep aspect.
    const maxH = vh * 0.96, maxW = vw * 0.8;
    let dw = img.width, dh = img.height;
    const s = Math.min(maxW / dw, maxH / dh);
    dw = Math.round(dw * s); dh = Math.round(dh * s);

    // offscreen sample
    const oc = document.createElement('canvas');
    oc.width = dw; oc.height = dh;
    const octx = oc.getContext('2d');
    octx.drawImage(img, 0, 0, dw, dh);
    const data = octx.getImageData(0, 0, dw, dh).data;

    const STEP = Math.max(3, Math.round(dw / 150)); // ~150 cols
    const parts = [];
    for (let y = 0; y < dh; y += STEP) {
      for (let x = 0; x < dw; x += STEP) {
        const i = (y * dw + x) * 4;
        const a = data[i + 3];
        if (a < 40) continue;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const lum = (r + g + b) / 3;
        if (lum < 16) continue;                 // drop near-black bg
        parts.push({
          x, y, r, g, b, a: a / 255,
          depth: Math.random(),                  // 0..1 -> parallax/size
          ang: -Math.PI / 2 + (Math.random() - 0.5) * 1.6, // mostly upward
          spd: 0.6 + Math.random() * 0.9,
          t0: (1 - y / dh) * 0.45 + Math.random() * 0.25,  // lower dissolves first
          wob: Math.random() * Math.PI * 2,
        });
      }
    }
    e.particles = parts; e.imgW = dw; e.imgH = dh; e.bitmap = img;
  };

  const loadImage = (dataURL) => {
    const img = new Image();
    img.onload = () => { buildField(img); setHasAngel(true); };
    img.src = dataURL;
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { localStorage.setItem(ANGEL_KEY, reader.result); } catch (err) {}
      loadImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ---- mount: restore + listeners + render loop ----------------------
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(ANGEL_KEY);
      if (saved) loadImage(saved);
    } catch (e) {}

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);

    const resize = () => {
      const stage = stageRef.current; if (!stage) return;
      canvas.width = stage.clientWidth * dpr;
      canvas.height = stage.clientHeight * dpr;
      canvas.style.width = stage.clientWidth + 'px';
      canvas.style.height = stage.clientHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (eng.current.bitmap) buildField(eng.current.bitmap);
    };
    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const wrap = wrapRef.current; if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.max(0, Math.min(1, -r.top / total)) : 0;
      eng.current.target = p;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMove = (ev) => {
      const stage = stageRef.current; if (!stage) return;
      const r = stage.getBoundingClientRect();
      eng.current.mouse.x = (ev.clientX - r.left) / r.width - 0.5;
      eng.current.mouse.y = (ev.clientY - r.top) / r.height - 0.5;
    };
    window.addEventListener('mousemove', onMove);

    const io = new IntersectionObserver(
      (entries) => { eng.current.inView = entries[0].isIntersecting; },
      { threshold: 0 }
    );
    if (stageRef.current) io.observe(stageRef.current);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let time = 0;

    const frame = () => {
      const e = eng.current;
      const stage = stageRef.current;
      eng.current.raf = requestAnimationFrame(frame);
      if (!stage || !e.inView) return;

      // ease progress toward scroll target
      e.progress += (e.target - e.progress) * 0.12;
      const p = e.progress;
      time += 0.016;

      const W = stage.clientWidth, H = stage.clientHeight;
      ctx.clearRect(0, 0, W, H);

      if (!e.particles.length) return;

      const ox = (W - e.imgW) / 2;
      const oy = H - e.imgH;   // bottom-anchored: image bottom sits on the viewport bottom
      const floatY = reduce ? 0 : Math.sin(time * 0.8) * 6;
      const mx = reduce ? 0 : e.mouse.x, my = reduce ? 0 : e.mouse.y;

      // crisp base image early, fading out as it dissolves
      const imgAlpha = 1 - smoothstep(0.04, 0.42, p);
      if (imgAlpha > 0.01 && e.bitmap) {
        ctx.save();
        ctx.globalAlpha = imgAlpha;
        ctx.filter = 'grayscale(0.2) contrast(1.05) brightness(0.95)';
        ctx.drawImage(e.bitmap, ox, oy + floatY, e.imgW, e.imgH);
        ctx.restore();
      }

      // particle ash
      const rise = H * 0.9;
      for (let k = 0; k < e.particles.length; k++) {
        const q = e.particles[k];
        const lp = smoothstep(q.t0, 1, p);            // per-particle local progress
        const appear = smoothstep(0.0, 0.18, p);
        const pa = q.a * appear * (1 - smoothstep(0.7, 1, lp));
        if (pa <= 0.01) continue;

        const dist = lp * rise * q.spd;
        const turb = reduce ? 0 : Math.sin(time * 1.3 + q.wob) * 16 * lp;
        const par = (0.4 + q.depth);                  // depth parallax factor
        const px = ox + q.x + Math.cos(q.ang) * dist + turb + mx * 28 * par;
        const py = oy + floatY + q.y + Math.sin(q.ang) * dist + my * 18 * par;

        const size = (1.4 + q.depth * 1.8) * (1 - lp * 0.5);
        const bright = 0.7 + q.depth * 0.5;
        ctx.globalAlpha = pa;
        ctx.fillStyle = `rgb(${Math.min(255, q.r * bright)},${Math.min(255, q.g * bright)},${Math.min(255, q.b * bright)})`;
        ctx.fillRect(px, py, size, size);
      }
      ctx.globalAlpha = 1;
    };
    eng.current.raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(eng.current.raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMove);
      io.disconnect();
    };
  }, []);

  return (
    <section ref={wrapRef} style={{ position: 'relative', height: '280vh' }}>
      <div ref={stageRef} style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%',
        overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

        {/* drop affordance */}
        {!hasAngel && (
          <div
            onDragOver={(e) => { e.preventDefault(); setOver(true); }}
            onDragLeave={() => setOver(false)}
            onDrop={(e) => { e.preventDefault(); setOver(false); handleFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current && fileRef.current.click()}
            style={{
              width: 280, height: 360, borderRadius: 12, cursor: 'pointer',
              border: `1px dashed ${over ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)'}`,
              background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 14, textAlign: 'center', padding: 24, zIndex: 2,
              boxShadow: over ? '0 0 30px rgba(255,255,255,0.12)' : 'none',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v6M12 21v-6M5 7c2 1 3 3 3 5M19 7c-2 1-3 3-3 5M3 12h4M17 12h4" /><circle cx="12" cy="12" r="2.4" />
            </svg>
            <div style={{ fontSize: '0.66rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--bone-200)', lineHeight: 1.9 }}>
              Drop your angel<br />
              <span style={{ color: 'var(--bone-400)' }}>it disintegrates as you scroll</span>
            </div>
          </div>
        )}

        {hasAngel && (
          <button onClick={() => fileRef.current && fileRef.current.click()} style={{
            position: 'absolute', bottom: '6vh', left: '50%', transform: 'translateX(-50%)',
            zIndex: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 999, padding: '8px 18px', cursor: 'pointer', backdropFilter: 'blur(10px)',
            fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: 'var(--bone-300)',
          }}>Replace angel</button>
        )}

        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])} />
      </div>
    </section>
  );
}

window.AngelDissolve = AngelDissolve;
