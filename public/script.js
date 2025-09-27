// script.js (module)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// quick selector
const $ = (s) => document.querySelector(s);

console.log('module script loaded');

// --- three.js scene setup (unchanged core, kept compact) ---
const canvas = $('#bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0c, 0.0035);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 18);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enabled = false;

// lights
const hemi = new THREE.HemisphereLight(0x26232b, 0x0a0520, 0.6);
scene.add(hemi);
const rim1 = new THREE.PointLight(0xff6ee7, 1.6, 60, 2.0);
rim1.position.set(-10, 8, 10);
scene.add(rim1);
const rim2 = new THREE.PointLight(0xa100ff, 0.8, 60, 2.0);
rim2.position.set(10, -6, -10);
scene.add(rim2);
const spotlight = new THREE.PointLight(0xff6ee7, 0.6, 50, 1.5);
spotlight.position.set(0,0,8);
scene.add(spotlight);

// objects
const magentaMat = new THREE.MeshStandardMaterial({
  color: 0x2a0520,
  metalness: 0.7,
  roughness: 0.1,
  emissive: 0xff6ee7,
  emissiveIntensity: 0.25,
});
const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(2.6, 0.6, 180, 24, 2, 3), magentaMat);
torus.position.set(-4, 0, -2);
scene.add(torus);

const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 2), new THREE.MeshStandardMaterial({
  color: 0x110018,
  emissive: 0xa100ff,
  emissiveIntensity: 0.18,
  metalness: 0.6,
  roughness: 0.25
}));
ico.position.set(3.5, -0.6, 2);
scene.add(ico);

// particles (reduced on mobile)
const particleCount = (/Mobi|Android/i.test(navigator.userAgent)) ? 400 : 1400;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const r = 12 + Math.random() * 20;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);
  positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
  positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
  positions[i*3+2] = r * Math.cos(phi);
}
const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMat = new THREE.PointsMaterial({ size: 0.06, color: 0xff6ee7, sizeAttenuation: true });
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// resize
function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize, { passive: true });

// mouse parallax + spotlight follow
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
  spotlight.position.x = mouse.x * 15;
  spotlight.position.y = mouse.y * 10;
  spotlight.position.z = 8;
});

// animation loop
let t0 = performance.now();
function animate(now) {
  const t = (now - t0) * 0.001;
  torus.rotation.y = 0.35 * t;
  torus.rotation.x = 0.12 * Math.sin(t * 0.9);
  ico.rotation.x = 0.25 * t;
  ico.rotation.z = 0.16 * t;
  particles.rotation.y = t * 0.02;
  particles.rotation.x = Math.sin(t * 0.05) * 0.02;
  camera.position.x += (mouse.x * 4 - camera.position.x) * 0.04;
  camera.position.y += (mouse.y * 2 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// --- DOM & UX effects ---
// we assume GSAP was loaded as a global (index.html <script src=...>); if not, fall back to CSS-only.
const GSAP_OK = (typeof gsap !== 'undefined');
if (!GSAP_OK) console.warn('GSAP not found as global. Button hover will still use CSS fallbacks.');

// helper: gsap wrapper that safely does nothing if gsap absent
const g = {
  to: (...args) => { if (GSAP_OK) gsap.to(...args); }
};

document.addEventListener('DOMContentLoaded', () => {

  // Custom cursor
const cursor = document.querySelector('.custom-cursor');
let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
let pos = { x: mouse.x, y: mouse.y };

// Track mouse
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  cursor.classList.add('move');
});

// Animate cursor smoothly
function cursorAnimate(){
  pos.x += (mouse.x - pos.x) * 0.18;
  pos.y += (mouse.y - pos.y) * 0.18;
  cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
  requestAnimationFrame(cursorAnimate);
}
requestAnimationFrame(cursorAnimate);

// Hover effects for interactive elements
const interactiveEls = document.querySelectorAll('.cta, .card, .navlinks a');
interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  el.addEventListener('mousedown', () => cursor.classList.add('click'));
  el.addEventListener('mouseup', () => cursor.classList.remove('click'));
});

  
  // year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // entrance animations (if gsap present)
  if (GSAP_OK) {
    gsap.from('.title', { opacity:0, y:30, duration:1.1, ease:"power3.out" });
    gsap.from('.tagline', { opacity:0, y:16, duration:0.9, delay:0.15 });
    gsap.from('.cta', { opacity:0, y:12, duration:0.9, stagger:0.06, delay:0.25 });
    gsap.from('.card', { opacity:0, y:30, scale:0.98, stagger:0.08, duration:0.9, delay:0.45, ease:"power3.out" });
  }

  // Card hover glow (gsap if available, otherwise CSS handles basic change)
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      g.to(card, { boxShadow: "0 0 30px rgba(255,110,231,0.6), 0 0 80px rgba(161,0,255,0.4)", duration: 0.34 });
    });
    card.addEventListener('mouseleave', () => {
      g.to(card, { boxShadow: "0 8px 30px rgba(0,0,0,0.6)", duration: 0.45 });
    });
  });

  // Title shimmer: toggle a CSS class which triggers a CSS keyframe (this is reliable)
  const title = document.querySelector('.title');
  if (title) {
    title.addEventListener('mouseenter', () => {
      title.classList.add('shimmer');
    });
    title.addEventListener('mouseleave', () => {
      // keep the animation until it finishes (about 1.1s), then remove class
      setTimeout(() => title.classList.remove('shimmer'), 1200);
    });
  }

  // Nav glow ripple (keep simple)
  document.querySelectorAll('.navlinks a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      g.to(link, { textShadow: "0 0 10px #ff6ee7, 0 0 20px #a100ff", duration: 0.28 });
    });
    link.addEventListener('mouseleave', () => {
      g.to(link, { textShadow: "0px 0px 0px transparent", duration: 0.28 });
    });
  });

  // *** CTA button hover: reliable GSAP + CSS fallback ***
  document.querySelectorAll('.cta').forEach(cta => {
    // sheen sweep on click or hover (add temporary class)
    cta.addEventListener('mouseenter', () => {
      // CSS transform + GSAP glow
      g.to(cta, { y: -6, scale: 1.03, boxShadow: '0 20px 80px rgba(255,110,231,0.28)', duration: 0.32, ease: 'power2.out' });
      // small sheen via CSS class
      cta.classList.add('sheen');
      // remove sheen after animation length
      setTimeout(() => cta.classList.remove('sheen'), 900);
    });
    cta.addEventListener('mouseleave', () => {
      g.to(cta, { y: 0, scale: 1, boxShadow: '0 6px 24px rgba(0,0,0,0.4)', duration: 0.4, ease: 'power3.out' });
      cta.classList.remove('sheen');
    });
    cta.addEventListener('mousedown', () => g.to(cta, { scale: 0.98, duration: 0.08 }));
    cta.addEventListener('mouseup', () => g.to(cta, { scale: 1.03, duration: 0.12 }));
  });

  // small breathing for lights (use gsap if available)
  if (GSAP_OK) {
    gsap.to(rim1, { intensity: 2.0, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(rim2, { intensity: 1.2, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
  } else {
    // fallback: slowly change emissive intensity w/ JS if gsap not present (cheap)
    let dir = 1, val = 1.6;
    setInterval(() => {
      val += 0.02 * dir;
      if (val > 2.0 || val < 1.2) dir *= -1;
      rim1.intensity = val;
      rim2.intensity = 0.7 + (val - 1.6) * 0.3;
    }, 120);
  }
});
