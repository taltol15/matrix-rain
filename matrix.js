// אפקט הגשם — canvas עם עמודות נופלות
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');

const KATAKANA = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';

let cfg = {
  color: '#00ff00',
  speed: 50,
  density: 100,
  fontSize: 18,
  charset: 'katakana',
  customText: 'TRUSTNO1',
  fade: 50
};

let drops = [];
let chars = KATAKANA;
let animId = null;
let lastTs = 0;
let frameGap = 33;

function charsetFor(c) {
  if (c.charset === 'latin') return LATIN;
  if (c.charset === 'numbers') return NUMBERS;
  if (c.charset === 'custom') {
    const t = (c.customText || '01').replace(/\s+/g, '');
    return t.length ? t : '01';
  }
  return KATAKANA;
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  rebuild();
}

function rebuild() {
  chars = charsetFor(cfg);
  const fontSize = Math.max(8, Number(cfg.fontSize) || 18);
  // צפיפות: כמה עמודות ביחס לרוחב — density 100 ≈ עמודה לכל fontSize פיקסלים
  const spacing = Math.max(8, fontSize * (200 / Math.max(10, Number(cfg.density) || 100)));
  const cols = Math.max(1, Math.floor(canvas.width / spacing));
  drops = Array.from({ length: cols }, () => ({
    x: 0,
    y: Math.random() * -canvas.height / fontSize,
    speed: 0.6 + Math.random() * 1.4
  }));
  // מיקום אופקי אחיד
  for (let i = 0; i < drops.length; i++) drops[i].x = i * spacing + spacing * 0.2;
  // מהירות: 1 איטי, 100 מהיר
  const s = Math.max(1, Math.min(100, Number(cfg.speed) || 50));
  frameGap = Math.max(8, 70 - s * 0.55);
  ctx.font = `${fontSize}px "Courier New", monospace`;
}

function applyConfig(next) {
  cfg = { ...cfg, ...next };
  rebuild();
}

function draw(ts) {
  animId = requestAnimationFrame(draw);
  if (ts - lastTs < frameGap) return;
  lastTs = ts;

  const fontSize = Math.max(8, Number(cfg.fontSize) || 18);
  const fade = Math.max(5, Math.min(95, Number(cfg.fade) || 50));
  // fade גבוה = שובל ארוך יותר (אלפא נמוך יותר בכל פריים)
  const alpha = 0.04 + (100 - fade) / 100 * 0.28;
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { r, g, b } = hexToRgb(cfg.color || '#00ff00');
  ctx.font = `${fontSize}px "Courier New", monospace`;
  ctx.textBaseline = 'top';

  for (const d of drops) {
    const ch = chars[Math.floor(Math.random() * chars.length)];
    // מוביל בהיר
    ctx.fillStyle = '#ffffff';
    ctx.fillText(ch, d.x, d.y * fontSize);
    // שובל בצבע שנבחר
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    const trail = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(trail, d.x, (d.y - 1) * fontSize);

    d.y += d.speed;
    if (d.y * fontSize > canvas.height && Math.random() > 0.975) {
      d.y = Math.random() * -20;
      d.speed = 0.6 + Math.random() * 1.4;
    }
  }
}

function exit() {
  if (animId) cancelAnimationFrame(animId);
  window.matrixAPI.closeMatrix();
}

window.addEventListener('resize', resize);
window.addEventListener('keydown', exit);
window.addEventListener('mousedown', exit);

window.matrixAPI.onMatrixConfig((c) => {
  applyConfig(c);
  if (!animId) {
    resize();
    lastTs = 0;
    animId = requestAnimationFrame(draw);
  }
});

// אם ההגדרות כבר נשלחו לפני שהאזנו — נטען מהשרת
window.matrixAPI.getConfig().then((c) => {
  applyConfig(c);
  if (!animId) {
    resize();
    animId = requestAnimationFrame(draw);
  }
});
