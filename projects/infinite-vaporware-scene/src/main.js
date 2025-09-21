// https://blog.maximeheckel.com/posts/vaporwave-3d-scene-with-threejs/

import * as THREE from "three"
import { GUI } from 'lil-gui'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import TEXTURE_PATH from './assets/grid-blue.png'
import DISPLACEMENT_PATH from './assets/displacementmap.png'

// Textures
const texture = new THREE.TextureLoader().load(TEXTURE_PATH)
const terrainTexture = new THREE.TextureLoader().load(DISPLACEMENT_PATH)

const material = new THREE.MeshStandardMaterial( { 
  map:texture,
  displacementMap: terrainTexture,
  // Tweak the displacement scale to adjust the "intensity" of the terrain
  displacementScale: 0.3,
} )

// Scene
const scene = new THREE.Scene()

const sceneBackgroundColor = {
  stop_1: '#00021e',
  stop_2: '#000000', 
  stop_3: '#000000'
}
function createGradientTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 256)
  gradient.addColorStop(0, sceneBackgroundColor.stop_1)
  gradient.addColorStop(0.3, sceneBackgroundColor.stop_2)
  gradient.addColorStop(1, sceneBackgroundColor.stop_3)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, 256)

  return new THREE.CanvasTexture(canvas)
}
function updateSceneBackground() {
  const gradientTexture = createGradientTexture()
  scene.background = gradientTexture
  // scene.background = new THREE.Color('#8bb388')
}

updateSceneBackground()


// Add some fog to the back of the scene
const fog = new THREE.Fog('#000000', 1, 2.5);
scene.fog = fog;

// Camera
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
const camera = new THREE.PerspectiveCamera(
  // field of view
  75,
  // aspect ratio
  sizes.width / sizes.height,
  // near plane: it's low since we want our mesh to be visible even from very close
  0.01,
  // far plane: how far we're rendering
  20
)
camera.position.set(0, 0.06, 1.1);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("three-canvas"),
  antialias: true
});
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
//adds inertia to the camera's movement, making it feel more realistic, like a real-world object that continues to move after you let go
controls.enableDamping = true 

/**
 * Plane Geometry
 */
const geometry = new THREE.PlaneGeometry(1, 2, 24, 24)
const plane = new THREE.Mesh(geometry, material)

// Here we position our plane flat in front of the camera
plane.rotation.x = -Math.PI * 0.5
plane.position.y = 0.0
plane.position.z = 0.15

/**
 * Here we define a second plane that will be positioned "behind" the first one
 * along the z axis.
 * We reuse the same geometry and material to define this new mesh.
 */
const plane2 = new THREE.Mesh(geometry, material);
plane2.rotation.x = -Math.PI * 0.5;
plane2.position.y = 0.0;
plane2.position.z = -1.85; // 0.15 - 2 (the length of the first plane)

scene.add(plane)
scene.add(plane2)


// Light
const ambientLight = new THREE.AmbientLight("#ffffff", 10)
scene.add(ambientLight)


// Handle Resize
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  // Update camera's aspect ratio and projection matrix
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  // Note: We set the pixel ratio of the renderer to at most 2
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
});

// Instantiate the Three.js Clock
const clock = new THREE.Clock()

// Animate: we call this tick function on every frame
const tick = () => {
  // Get the elapsedTime since the scene rendered from the clock
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  /**
   * When the first plane reaches a position of z = 2
   * we reset it to 0, its initial position
   */
  plane.position.z = (elapsedTime * 0.15) % 2
  /**
   * When the first plane reaches a position of z = 0
   * we reset it to -2, its initial position
   */
  plane2.position.z = ((elapsedTime * 0.15) % 2) - 2


  // Update the rendered scene
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
};

// Calling tick will initiate the rendering of the scene
tick()
