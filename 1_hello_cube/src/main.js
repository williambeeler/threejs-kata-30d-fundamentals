import * as THREE from "three"
import { GUI } from 'lil-gui'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

//Gui
const gui = new GUI()
const lightFolder = gui.addFolder('Light Folder')
const geometryFolder = gui.addFolder('Cube')
const animationFolder = gui.addFolder('Animation')


// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xD6D6D6);

console.log(scene)

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three-canvas"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Light
const ambientLight = new THREE.AmbientLight(0xD6D6D6, 0.9);
scene.add(ambientLight);
lightFolder.add(ambientLight, 'intensity', 0, 10, 0.1).name('Ambient Light Intensity')
lightFolder.addColor(ambientLight, 'color').name('Ambient Light Color')

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Hello Cube 1
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Lil-gui mesh manipulation
const geometryParams = { width: 1, height: 1, depth: 1 };
function rebuildBox() {
  cube.geometry.dispose();
  cube.geometry = new THREE.BoxGeometry(geometryParams.width, geometryParams.height, geometryParams.depth);
}
geometryFolder.add(geometryParams, 'width', 0.1, 10, 0.1).onChange(rebuildBox);
geometryFolder.add(geometryParams, 'height', 0.1, 10, 0.1).onChange(rebuildBox);
geometryFolder.add(geometryParams, 'depth', 0.1, 10, 0.1).onChange(rebuildBox);



// Handle Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
let rotationSpeed = { speed: 0.01 }
animationFolder.add(rotationSpeed, 'speed', 0, 5, 0.01).name('Rotation Speed')
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += rotationSpeed.speed;
  cube.rotation.y += rotationSpeed.speed;
  controls.update();
  renderer.render(scene, camera);
}
animate();
