// ISC
// Imports 
import * as THREE from 'three'
import { GUI } from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Lil' goo 
const gui = new GUI()
const sceneFolder = gui.addFolder('Scene').close()
// const cameraFolder = gui.addFolder('Camera Folder').close()
const lightingFolder = gui.addFolder('Lighting').close()
// const otherFolder = gui.addFolder('Other').close()

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
camera.position.set(4.4, 3.4, 6)

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

// Vector2 and Raycasting = used for the clicking part of this excercise
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// ====== Geometry ========

//    Floor Geometry  
// =====================
const floorParameters = {
  width: 13,
  height: 5,
  widthSegments: 8,
  heightSegments: 8
}
let floorGeometry = new THREE.PlaneGeometry(floorParameters.width, floorParameters.height, floorParameters.widthSegments, floorParameters.heightSegments)
const floorMaterial = new THREE.MeshStandardMaterial({ color: '#656462' })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = - Math.PI / 2
scene.add(floor)

// Function to rebuild geometry
function updateFloor() {
  floor.geometry.dispose() // free memory
  floor.geometry = new THREE.PlaneGeometry(
    floorParameters.width,
    floorParameters.height,
    floorParameters.widthSegments,
    floorParameters.heightSegments
  )
}

gui.add(floorMaterial, 'wireframe').name('Floor Wireframe')
gui.add(floorParameters, 'width', 1, 30, 1).name('Floor width').onChange(updateFloor)
gui.add(floorParameters, 'height', 1, 30, 1).name('Floor height').onChange(updateFloor)
gui.add(floorParameters, 'widthSegments', 1, 20, 1).name('Width segments').onChange(updateFloor)
gui.add(floorParameters, 'heightSegments', 1, 20, 1).name('Height segments').onChange(updateFloor)




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