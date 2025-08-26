// ISC
// Imports 
import * as THREE from 'three'
import { GUI } from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Lil' goo 
const gui = new GUI()
const geometryFolder = gui.addFolder('Geometry & Objects')
const lightingFolder = gui.addFolder('Lighting')
const otherFolder = gui.addFolder('Other')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#8bb388')

console.log(scene)

//Axes and other helpers
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(2, 2, 5)

// RCL
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)


// Lights
const ambientLight = new THREE.AmbientLight(0xD6D6D6, 0.9)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
directionalLight.position.set(2,2,7)
scene.add(directionalLight)

// GRA
// Geometry 
const floorGeometry = new THREE.PlaneGeometry()
const floorMaterial = new THREE.MeshStandardMaterial({ color: '#0077ff' })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
scene.add(floor)


// Resize
window.addEventListener('resize', () => {
    console.log('Resized')
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth / window.innerHeight)
})


// Animation
let rotationSpeed = { speed: 0.01 }
function animate() {
  requestAnimationFrame(animate);
//   cube.rotation.x += rotationSpeed.speed;
//   cube.rotation.y += rotationSpeed.speed;
  controls.update();
  renderer.render(scene, camera);
}
animate();