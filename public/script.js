// script.js (type=module)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

// quick helpers
const $ = (s) => document.querySelector(s);

// Setup renderer + scene
const canvas = $('#bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 18);

// Controls (subtle, mostly for development)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enabled = false; // keep disabled by default; toggle true for debugging

// Lighting - magenta rim + soft fill
const fill = new THREE.HemisphereLight(0x26232b, 0x0a0520, 0.6);
scene.add(fill);

const rim = new THREE.PointLight(0xff6ee7, 1.6, 60, 2.0);
rim.position.set(-10, 8, 10);
scene.add(rim);

const rim2 = new THREE.PointLight(0xa100ff, 0.8, 60, 2.0);
rim2.position.set(10, -6, -10);
scene.add(rim2);

// Create a shiny magenta torus + emissive material
const magentaMat = new THREE.MeshStandardMaterial({
  color: 0x2a0520,
  metalness: 0.7,
  roughness: 0.1,
  emissive: 0xff6ee7,
  emissiveIntensity: 0.25,
});

const torusGeo = new THREE.TorusKnotGeometry(2.6, 0.6, 180, 24, 2, 3);
const torus = new THREE.Mesh(torusGeo, magentaMat);
torus.position.set(-4, 0, -2);
torus.scale.set(0.9,0.9,0.9);
scene.add(torus);

// Floating icosahedron
const icoGeo = new THREE.IcosahedronGeometry(1.2, 2);
const icoMat = new THREE.MeshStandardMaterial({
  color: 0x110018,
  emissive: 0xa100ff,
  emissiveIntensity: 0.18,
  metalness: 0.6,
  roughness: 0.25
});
const ico = new THREE.Mesh(icoGeo, icoMat);
ico.position.set(3.5, -0.6, 2);
ico.scale.set(1.2,1.2,1.2);
scene.add(ico);

// Particle field
const particleCount = ( /Mobi|Android/i.test(navigator.userAgent) ) ? 400 : 1400;
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
const particlesMat = new THREE.PointsMaterial({
  size: 0.06,
  sizeAttenuation: true,
  color: 0xff6ee7,
  fog: false,
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// subtle ambient fog to add depth
scene.fog = new THREE.FogExp2(0x0a0a0c, 0.0035);

// Resize handling
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize, { passive: true });

// Parallax mouse
const mouse = { x:0, y:0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

// animation loop
let t0 = performance.now();
function animate(now) {
  const t = (now - t0) * 0.001;
  // rotate objects
  torus.rotation.y = 0.35 * t;
  torus.rotation.x = 0.12 * Math.sin(t * 0.9);
  ico.rotation.x = 0.25 * t;
  ico.rotation.z = 0.16 * t;

  // particle slow rotation for depth
  particles.rotation.y = t * 0.02;
  particles.rotation.x = Math.sin(t * 0.05) * 0.02;

  // gentle camera parallax based on mouse
  camera.position.x += (mouse.x * 4 - camera.position.x) * 0.04;
  camera.position.y += (mouse.y * 2 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// GSAP + DOM effects: title glow, cards entrance, card tilt on mouse
document.addEventListener('DOMContentLoaded', () => {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // title entrance
  gsap.from('.title', { opacity:0, y:30, duration:1.1, ease:"power3.out" });
  gsap.from('.tagline', { opacity:0, y:16, duration:0.9, delay:0.15 });
  gsap.from('.cta', { opacity:0, y:12, duration:0.9, stagger:0.06, delay:0.25 });

  // cards pop
  const cards = document.querySelectorAll('.card');
  gsap.from(cards, { opacity:0, y:30, scale:0.98, stagger:0.08, duration:0.9, delay:0.45, ease:"power3.out" });

  // card hover tilt
  cards.forEach(card => {
    card.addEventListener('mousemove', (ev) => {
      const rect = card.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width;
      const py = (ev.clientY - rect.top) / rect.height;
      const rotY = (px - 0.5) * 12; // degrees
      const rotX = (0.5 - py) * 8;
      gsap.to(card, { rotationY: rotY, rotationX: rotX, scale:1.02, transformPerspective:500, transformOrigin:"center", duration:0.35, ease:"power2.out" });
      card.style.boxShadow = `0 18px 60px rgba(161,0,255,0.08)`;
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY:0, rotationX:0, scale:1, duration:0.45, ease:"power3.out" });
      card.style.boxShadow = '';
    });
    // click tilt pop
    card.addEventListener('mousedown', () => gsap.to(card, { scale:0.99, duration:0.08 }));
    card.addEventListener('mouseup', () => gsap.to(card, { scale:1.02, duration:0.12 }));
  });
});
