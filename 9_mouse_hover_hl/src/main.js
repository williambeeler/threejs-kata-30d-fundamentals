// Testing Raycaster 
// Docs: https://threejs.org/docs/#api/en/core/Raycaster
// Threejs Journey: https://threejs-journey.com/lessons/raycaster-and-mouse-events
// Imports 
import * as THREE from 'three'
import { GUI } from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Lil' goo 
const gui = new GUI()
const sceneFolder = gui.addFolder('Scene').close()
const rayFolder = gui.addFolder('Ray Folder').close()
const lightingFolder = gui.addFolder('Lighting').close()
const ballsFolder = gui.addFolder('Balls').open()

// Scene
const scene = new THREE.Scene()
const sceneBackgroundColor = {
  stop_1: '#296818',
  stop_2: '#125e5d', 
  stop_3: '#5f9187'
}
function createGradientTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, 256)
  gradient.addColorStop(0, sceneBackgroundColor.stop_1)
  gradient.addColorStop(0.5, sceneBackgroundColor.stop_2)
  gradient.addColorStop(1, sceneBackgroundColor.stop_3)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1, 256)

  return new THREE.CanvasTexture(canvas)
}
function updateSceneBackground() {
  const gradientTexture = createGradientTexture()
  scene.background = gradientTexture
}

updateSceneBackground()

sceneFolder.addColor(sceneBackgroundColor, 'stop_1').name('Scene Background Color 1').onChange(() => updateSceneBackground())
sceneFolder.addColor(sceneBackgroundColor, 'stop_2').name('Scene Background Color 2').onChange(() => updateSceneBackground())
sceneFolder.addColor(sceneBackgroundColor, 'stop_3').name('Scene Background Color 3').onChange(() => updateSceneBackground())

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 11, 3)

sceneFolder.add(camera.position, 'x', -20, 20, 1).name('Camera X')
sceneFolder.add(camera.position, 'y', -20, 20, 1).name('Camera Y')
sceneFolder.add(camera.position, 'z', -20, 20, 1).name('Camera Z')

// RCL
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("three-canvas"),
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)

// Materials 
// Always test first on https://threejs.org/docs/#api/en/materials/MeshPhongMaterial
const greenMaterial = new THREE.MeshPhongMaterial({
  color: '#E1C16E',
  opacity: 1, 
  emissive: '#E1C16E',
  specular: '#E1C16E'
})
const redMaterial = new THREE.MeshPhongMaterial({
  color: '#dd8e5a',
  opacity: 1, 
  emissive: '#200404',
  specular: '#ecc293'
})

// Lights
const ambientLight = new THREE.AmbientLight('#0b86de', 0.3)
scene.add(ambientLight)
lightingFolder.addColor(ambientLight, 'color').name('Ambient Light Color')
lightingFolder.add(ambientLight, 'intensity', 0, 5, 0.1).name('Ambient Light Intensity')

const directionalLight = new THREE.DirectionalLight('#ffe14d', 5)
directionalLight.position.set(1,5,3)
scene.add(directionalLight)

directionalLight.position.set(2.2, 4.2, -1.2)

//Lighting guis
lightingFolder.addColor(directionalLight, 'color').name('Directional Light Color')
lightingFolder.add(directionalLight, 'intensity', 0, 5, 0.1).name('Directional Light Intensity')
lightingFolder.add(directionalLight.position, 'x', -10, 10, 0.2).name('DL X')
lightingFolder.add(directionalLight.position, 'y', -10, 10, 0.2).name('DL Y')
lightingFolder.add(directionalLight.position, 'z', -10, 10, 0.2).name('DL Z')
lightingFolder.add(directionalLight.rotation, 'x', -10, 10, 0.2).name('DL Rotate X')
lightingFolder.add(directionalLight.rotation, 'y', -10, 10, 0.2).name('DL Rotate Y')
lightingFolder.add(directionalLight.rotation, 'z', -10, 10, 0.2).name('DL Rotate Z')

// ====== Geometry ========

//    Ball Geometry  
// =====================
const ball1_geometry = new THREE.SphereGeometry(2, 32, 16)
const ball2_geometry = new THREE.SphereGeometry(2, 32, 16)
const ball3_geometry = new THREE.SphereGeometry(2, 32, 16)
const ball1 = new THREE.Mesh(ball1_geometry, greenMaterial)
const ball2 = new THREE.Mesh(ball2_geometry, greenMaterial)
const ball3 = new THREE.Mesh(ball3_geometry, greenMaterial)
scene.add(ball1)
scene.add(ball2)
scene.add(ball3)

ball1.position.set(-5.2, 2, 0)
ball2.position.set(0, 2, 0)
ball3.position.set(5.2, 2, 0)

ballsFolder.add(ball1.position, 'x', -10, 10, 0.2).name('Ball 1 X')
ballsFolder.add(ball1.position, 'y', -10, 10, 0.2).name('Ball 1 Y')
ballsFolder.add(ball1.position, 'z', -10, 10, 0.2).name('Ball 1 Z')

ballsFolder.add(ball2.position, 'x', -10, 10, 0.2).name('Ball 2 X')
ballsFolder.add(ball2.position, 'y', -10, 10, 0.2).name('Ball 2 Y')
ballsFolder.add(ball2.position, 'z', -10, 10, 0.2).name('Ball 2 Z')

ballsFolder.add(ball3.position, 'x', -10, 10, 0.2).name('Ball 3 X')
ballsFolder.add(ball3.position, 'y', -10, 10, 0.2).name('Ball 3 Y')
ballsFolder.add(ball3.position, 'z', -10, 10, 0.2).name('Ball 3 Z')


// Vector2 and Raycasting = used for the clicking part of this excercise
const rayParams = {
  originX: -3,
  originY: 0,
  originZ: 0,
  directionX: 10,
  directionY: 0,
  directionZ: 0,
  length: 10
}
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const origin = new THREE.Vector3(rayParams.originX, rayParams.originY, rayParams.originZ)
const direction = new THREE.Vector3(rayParams.directionX, rayParams.directionY, rayParams.directionZ)

// visualize with an ArrowHelper
const arrow = new THREE.ArrowHelper(direction, origin, 10, 0xff0000)
scene.add(arrow)

raycaster.set(origin, direction)
arrow.position.copy(origin)
arrow.setDirection(direction)

arrow.setLength(rayParams.length)
console.log(arrow)

rayFolder.add(arrow, 'visible').name('Show Ray')
rayFolder.add(rayParams, 'length', 0.1, 50, 0.1)
  .name('Ray Length')
  .onChange(v => arrow.setLength(v))




// Window click event and action
window.addEventListener('mouseup', (event) => {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera)

  // Calculate objects intersecting the ray
  const intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length > 0) {
    console.log('You clicked on:', intersects[0].object)
  }
})

window.addEventListener('mouseover', (event) => {
  //Do something
})


// ========== end of project / finish with Resize and Animate ===========

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Animation
function animate() {
  requestAnimationFrame(animate)

  controls.update()
  renderer.render(scene, camera)
}
animate();