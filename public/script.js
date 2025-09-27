import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

const $ = (s) => document.querySelector(s);

const canvas = $('#bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 18);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enabled = false;

// Lights
const hemi = new THREE.HemisphereLight(0x26232b, 0x0a0520, 0.6);
scene.add(hemi);

const rim1 = new THREE.PointLight(0xff6ee7, 1.6, 60, 2.0);
rim1.position.set(-10, 8, 10);
scene.add(rim1);

const rim2 = new THREE.PointLight(0xa100ff, 0.8, 60, 2.0);
rim2.position.set(10, -6, -10);
scene.add(rim2);

// Spotlight that follows mouse
const spotlight = new THREE.PointLight(0xff6ee7, 0.6, 50, 1.5);
scene.add(spotlight);

// Objects
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

// Particles
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
const particlesMat = new THREE.PointsMaterial({ size: 0.06, color: 0xff6ee7 });
scene.add(new THREE.Points(particlesGeo, particlesMat));

scene.fog = new THREE.FogExp2(0x0a0a0c, 0.0035);

// Resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Mouse
const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // Move spotlight
  spotlight.position.x = mouse.x * 15;
  spotlight.position.y = mouse.y * 10;
  spotlight.position.z = 8;
});

// Animate
let t0 = performance.now();
function animate(now) {
  const t = (now - t0) * 0.001;

  torus.rotation.y = 0.35 * t;
  ico.rotation.x = 0.25 * t;
  ico.rotation.z = 0.16 * t;

  camera.position.x += (mouse.x * 4 - camera.position.x) * 0.04;
  camera.position.y += (mouse.y * 2 - camera.position.y) * 0.04;
  camera.lookAt(0, 0, 0);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// --- DOM FX ---
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  gsap.from('.title', { opacity: 0, y: 30, duration: 1.1, ease: "power3.out" });
  gsap.from('.cta', { opacity: 0, y: 20, duration: 0.9, stagger: 0.08, delay: 0.2 });

  // Card hover glow
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        boxShadow: "0 0 25px rgba(255,110,231,0.6), 0 0 60px rgba(161,0,255,0.4)",
        duration: 0.4
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
        duration: 0.4
      });
    });
  });

  // Title shimmer
  const title = document.querySelector('.title');
  title.addEventListener('mouseenter', () => {
    gsap.to(title, {
      backgroundImage: "linear-gradient(90deg, #fff, #ff6ee7, #a100ff, #fff)",
      backgroundSize: "300%",
      backgroundClip: "text",
      textFillColor: "transparent",
      duration: 0.6,
      repeat: 1,
      yoyo: true,
      ease: "power2.inOut"
    });
  });

  // Nav glow ripple
  document.querySelectorAll('.navlinks a').forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, { textShadow: "0 0 10px #ff6ee7, 0 0 20px #a100ff", duration: 0.3 });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { textShadow: "0px 0px 0px transparent", duration: 0.4 });
    });
  });

  // Light breathing effect
  gsap.to(rim1, { intensity: 2.0, duration: 3, yoyo: true, repeat: -1, ease: "sine.inOut" });
  gsap.to(rim2, { intensity: 1.2, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
});
