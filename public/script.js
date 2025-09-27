:root{
  --bg: #0a0a0c;
  --panel: #0f0f12;
  --magenta-1: #ff6ee7;
  --magenta-2: #a100ff;
  --muted: #bfb8c6;
  --glass: rgba(255,255,255,0.03);
  --shadow: 0 10px 30px rgba(0,0,0,0.7);
  --max-width: 1100px;
}

/* Reset */
*{box-sizing:border-box}
html,body,#app{height:100%}
body{
  margin:0;
  font-family:Inter,system-ui,sans-serif;
  background:var(--bg);
  color:#eee;
  overflow:auto;
}

/* Canvas background */
canvas#bg{
  position:fixed;
  inset:0;
  width:100%;
  height:100%;
  z-index:0;
  display:block;
  background: radial-gradient(1200px circle at 15% 20%, rgba(161,0,255,0.08), transparent 6%),
              radial-gradient(900px circle at 85% 70%, rgba(255,110,231,0.06), transparent 8%),
              linear-gradient(180deg, #05050a 0%, #0a0a0c 100%);
}

/* Custom cursor */
.custom-cursor{
  position: fixed;
  top: 0;
  left: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--magenta-1);
  box-shadow: 0 0 6px rgba(255,110,231,0.5), 0 0 12px rgba(161,0,255,0.3);
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.12s ease, width 0.15s ease, height 0.15s ease, background 0.25s ease, box-shadow 0.25s ease;
}
.custom-cursor.hover{
  width: 34px;
  height: 34px;
  background: rgba(255,110,231,0.4);
  box-shadow: 0 0 20px rgba(255,110,231,0.6), 0 0 40px rgba(161,0,255,0.4);
}
.custom-cursor.click{
  width: 26px;
  height: 26px;
  background: var(--magenta-2);
  box-shadow: 0 0 16px rgba(161,0,255,0.6),0 0 30px rgba(255,110,231,0.5);
}

/* UI elements */
.ui{position:relative;z-index:5;max-width:var(--max-width);margin:0 auto;padding:32px}
.topbar{display:flex;justify-content:space-between;align-items:center;padding:8px 0;color:var(--muted);}
.topbar .brand{font-weight:700;color:var(--magenta-1);}
.topbar .navlinks a{margin-left:18px;text-decoration:none;color:var(--muted);font-weight:600;transition: transform .18s ease, text-shadow .25s ease;}
.topbar .navlinks a:hover{color:var(--magenta-1); text-shadow:0 8px 40px rgba(161,0,255,0.12); transform: translateY(-2px);}

/* Hero */
.hero{margin-top:30px;padding:48px;border-radius:14px;background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));box-shadow: var(--shadow);backdrop-filter: blur(6px) saturate(120%);}
.title{margin:0 0 8px;font-size: clamp(28px, 5vw, 56px);}
.tagline{margin:0 0 16px;color:var(--muted);}
.cta-row{display:flex;gap:12px;margin-top:18px}
.cta{padding:10px 16px;border-radius:10px;text-decoration:none;background: linear-gradient(90deg, rgba(161,0,255,0.15), rgba(255,110,231,0.08));color:var(--magenta-1);font-weight:700;transition: transform .25s ease, box-shadow .28s ease;}
.cta:hover{transform: translateY(-4px) scale(1.02);color:white;box-shadow:0 20px 60px rgba(255,110,231,0.14), inset 0 0 40px rgba(161,0,255,0.04);}
.cta.ghost{background: transparent; color:var(--muted); border:1px solid rgba(255,255,255,0.04);}

/* Project cards */
.cards{display:grid;grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:16px;margin-top:14px;}
.card{padding:18px;border-radius:12px;background: linear-gradient(180deg, rgba(20,12,20,0.6), rgba(10,8,12,0.6));box-shadow: 0 8px 30px rgba(0,0,0,0.6),0 0 18px rgba(161,0,255,0.03) inset;cursor:pointer; text-decoration:none; color:inherit; display:block; transform-style: preserve-3d; transition: transform 0.25s ease, box-shadow 0.25s ease;}
.card h3{margin:0 0 8px;color:var(--magenta-1)}
.card p{margin:0;color:var(--muted);font-size:0.95rem}

/* Footer */
.footer{padding:28px 0;text-align:center;color:var(--muted);}
