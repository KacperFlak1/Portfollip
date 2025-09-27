import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/OrbitControls.js';

const $ = s => document.querySelector(s);

// --- Three.js scene ---
const canvas = $('#bg');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0c, 0.0035);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 2000);
camera.position.set(0,0,18);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.enabled=false;

const hemi = new THREE.HemisphereLight(0x26232b,0x0a0520,0.6); scene.add(hemi);
const rim1 = new THREE.PointLight(0xff6ee7,1.6,60,2); rim1.position.set(-10,8,10); scene.add(rim1);
const rim2 = new THREE.PointLight(0xa100ff,0.8,60,2); rim2.position.set(10,-6,-10); scene.add(rim2);
const spotlight = new THREE.PointLight(0xff6ee7,0.6,50,1.5); spotlight.position.set(0,0,8); scene.add(spotlight);

const magentaMat = new THREE.MeshStandardMaterial({color:0x2a0520,metalness:0.7,roughness:0.1,emissive:0xff6ee7,emissiveIntensity:0.25});
const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(2.6,0.6,180,24,2,3), magentaMat);
torus.position.set(-4,0,-2); scene.add(torus);

const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,2), new THREE.MeshStandardMaterial({color:0x110018,emissive:0xa100ff,emissiveIntensity:0.18,metalness:0.6,roughness:0.25}));
ico.position.set(3.5,-0.6,2); scene.add(ico);

const particleCount = (/Mobi|Android/i.test(navigator.userAgent)) ? 400 : 1400;
const positions = new Float32Array(particleCount*3);
for(let i=0;i<particleCount;i++){
  const r=12+Math.random()*20, theta=Math.random()*Math.PI*2, phi=Math.acos((Math.random()*2)-1);
  positions[i*3]=r*Math.sin(phi)*Math.cos(theta);
  positions[i*3+1]=r*Math.sin(phi)*Math.sin(theta);
  positions[i*3+2]=r*Math.cos(phi);
}
const particlesGeo=new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
const particlesMat = new THREE.PointsMaterial({size:0.06,color:0xff6ee7, sizeAttenuation:true});
scene.add(new THREE.Points(particlesGeo, particlesMat));

window.addEventListener('resize',()=>{renderer.setSize(window.innerWidth,window.innerHeight);camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();});

const mouse={x:0,y:0};
window.addEventListener('mousemove',e=>{mouse.x=(e.clientX/window.innerWidth)*2-1;mouse.y=-(e.clientY/window.innerHeight)*2+1;spotlight.position.x=mouse.x*15;spotlight.position.y=mouse.y*10;spotlight.position.z=8;});

function animate(now){
  const t=(now-performance.now())*0.001;
  torus.rotation.y=0.35*t; torus.rotation.x=0.12*Math.sin(t*0.9);
  ico.rotation.x=0.25*t; ico.rotation.z=0.16*t;
  particles.rotation.y=t*0.02; particles.rotation.x=Math.sin(t*0.05)*0.02;
  camera.position.x+=(mouse.x*4-camera.position.x)*0.04;
  camera.position.y+=(mouse.y*2-camera.position.y)*0.04;
  camera.lookAt(0,0,0);
  controls.update();
  renderer.render(scene,camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// --- DOM ---
document.addEventListener('DOMContentLoaded',()=>{

  document.getElementById('year').textContent=new Date().getFullYear();

  const cursor = document.querySelector('.custom-cursor');
  let mousePos={x:window.innerWidth/2,y:window.innerHeight/2}, pos={x:mousePos.x,y:mousePos.y};
  window.addEventListener('mousemove', e=>{mousePos.x=e.clientX; mousePos.y=e.clientY; cursor.classList.add('move');});
  function cursorAnimate(){pos.x+=(mousePos.x-pos.x)*0.18; pos.y+=(mousePos.y-pos.y)*0.18; cursor.style.transform=`translate(${pos.x}px,${pos.y}px) translate(-50%,-50%)`;requestAnimationFrame(cursorAnimate);}
  requestAnimationFrame(cursorAnimate);

  const interactiveEls=document.querySelectorAll('.cta, .
