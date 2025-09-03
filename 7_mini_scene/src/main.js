// ISC
// Imports 
import * as THREE from 'three'
import { GUI } from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Lil' goo 
const gui = new GUI()
const sceneFolder = gui.addFolder('Scene').close()
const cameraFolder = gui.addFolder('Camera Folder').close()
const lightingFolder = gui.addFolder('Lighting').close()

const geometryFolder = gui.addFolder('Geometry & Objects').open()
  const floorFolder = geometryFolder.addFolder('Floor').close()
  const cubeFolder = geometryFolder.addFolder('Cube').close()
  const torusFolder = geometryFolder.addFolder('Torus').close()
  const coneFolder = geometryFolder.addFolder('Cone').close()
  const wallsFolder = geometryFolder.addFolder('Walls').close()

const otherFolder = gui.addFolder('Other').close()

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
  // scene.background = new THREE.Color('#8bb388')
}

updateSceneBackground()

sceneFolder.addColor(sceneBackgroundColor, 'stop_1').name('Scene Background Color 1').onChange(() => updateSceneBackground())
sceneFolder.addColor(sceneBackgroundColor, 'stop_2').name('Scene Background Color 2').onChange(() => updateSceneBackground())
sceneFolder.addColor(sceneBackgroundColor, 'stop_3').name('Scene Background Color 3').onChange(() => updateSceneBackground())

//Axes and other helpers
const axesHelper = new THREE.AxesHelper(5)
const objAxesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)
axesHelper.visible = false
otherFolder.add(axesHelper, 'visible').name('Enable Axes helper')

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(4.4, 3.4, 6)
cameraFolder.add(camera.position, 'x', -10, 10, 0.2).name('Camera X')
cameraFolder.add(camera.position, 'y', -10, 10, 0.2).name('Camera Y')
cameraFolder.add(camera.position, 'z', -10, 10, 0.2).name('Camera Z')

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
const brassMaterial = new THREE.MeshPhongMaterial({
  color: '#E1C16E',
  opacity: 1, 
  emissive: '#E1C16E',
  specular: '#E1C16E'
})
const bronzeMaterial = new THREE.MeshPhongMaterial({
  color: '#dd8e5a',
  opacity: 1, 
  emissive: '#200404',
  specular: '#ecc293'
})
const greenMaterial = new THREE.MeshPhongMaterial({
  color: '#3ea437',
  opacity: 0.7, 
  emissive: '#000',
  specular: '#000',
})
// Physical "glass" material
const glassMat = new THREE.MeshPhysicalMaterial({
  // Glassiness
  transmission: 1.0,         // let light through (not the same as opacity!)
  ior: 1.5,                   // index of refraction ~ glass
  thickness: 0.4,             // in world units; fakes actual thickness

  // Surface look
  roughness: 0.05,            // lower = sharper reflections
  metalness: 0.0,
  specularIntensity: 1.0,
  specularColor: new THREE.Color(0xffffff),
  clearcoat: 1.0,             // optional: extra shiny “varnish” layer
  clearcoatRoughness: 0.05,

  // Color/tint absorption through the volume
  attenuationColor: new THREE.Color(0x88cfff), // subtle blue tint
  attenuationDistance: 2.0,   // how quickly color is absorbed through thickness

  envMapIntensity: 1.0,
  side: THREE.FrontSide,      // keep FrontSide for correct refraction
  transparent: false          // keep false with transmission (important!)
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
directionalLight.add(objAxesHelper)
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
  width: 8,
  height: 8,
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

floorFolder.add(floorMaterial, 'wireframe').name('Floor Wireframe')
floorFolder.add(floorParameters, 'width', 1, 30, 1).name('Floor width').onChange(updateFloor)
floorFolder.add(floorParameters, 'height', 1, 30, 1).name('Floor height').onChange(updateFloor)
floorFolder.add(floorParameters, 'widthSegments', 1, 20, 1).name('Width segments').onChange(updateFloor)
floorFolder.add(floorParameters, 'heightSegments', 1, 20, 1).name('Height segments').onChange(updateFloor)

//    Walls Geometry  
// =====================
const wall1Parameters = {
  width: 8,
  height: 4,
  widthSegments: 8,
  heightSegments: 8
}
const wall2Parameters = { 
  width: 8,
  height: 4,
  widthSegments: 8,
  heightSegments: 8
}
let wall1Geometry = new THREE.PlaneGeometry(wall1Parameters.width, wall1Parameters.height, wall1Parameters.widthSegments, wall1Parameters.heightSegments)
let wall2Geometry = new THREE.PlaneGeometry(wall2Parameters.width, wall2Parameters.height, wall2Parameters.widthSegments, wall2Parameters.heightSegments)

const wallMaterial = new THREE.MeshStandardMaterial({ color: '#656462' })
const wall1 = new THREE.Mesh(wall1Geometry, wallMaterial)
const wall2 = new THREE.Mesh(wall2Geometry, wallMaterial)

// wall1.rotation.x = - Math.PI / 2
scene.add(wall1)
scene.add(wall2)

wall1.position.y = 2
wall1.position.x = -4
wall1.rotation.y = Math.PI / 2

wall2.position.y = 2
wall2.position.z = -4

// Function to rebuild geometry
function updateWalls() {
  wall1.geometry.dispose() // free memory
  wall1.geometry = new THREE.PlaneGeometry(
    wall1Parameters.width,
    wall1Parameters.height,
    wall1Parameters.widthSegments,
    wall1Parameters.heightSegments
  )
  wall2.geometry.dispose() // free memory
  wall2.geometry = new THREE.PlaneGeometry(
    wall2Parameters.width,
    wall2Parameters.height,
    wall2Parameters.widthSegments,
    wall2Parameters.heightSegments
  )
}

wallsFolder.add(wallMaterial, 'wireframe').name('Walls Wireframe')
wallsFolder.add(wall1Parameters, 'width', 1, 30, 1).name('Wall 1 width').onChange(updateWalls)
wallsFolder.add(wall1Parameters, 'height', 1, 30, 1).name('Wall 1 height').onChange(updateWalls)
wallsFolder.add(wall1Parameters, 'widthSegments', 1, 20, 1).name('Wall 1 segments').onChange(updateWalls)
wallsFolder.add(wall1Parameters, 'heightSegments', 1, 20, 1).name('Wall 1 segments').onChange(updateWalls)
wallsFolder.add(wall1.position, 'x', -10, 10, 0.1).name('Wall 1 X')
wallsFolder.add(wall1.position, 'y', -10, 10, 0.1).name('Wall 1 Y')
wallsFolder.add(wall1.position, 'z', -10, 10, 0.1).name('Wall 1 Z')
wallsFolder.add(wall1.rotation, 'x', -10, 10, 0.1).name('Wall 1 Rotate X')
wallsFolder.add(wall1.rotation, 'y', -10, 10, 0.1).name('Wall 1 Rotate Y')
wallsFolder.add(wall1.rotation, 'z', -10, 10, 0.1).name('Wall 1 Rotate Z')

wallsFolder.add(wall2Parameters, 'width', 1, 30, 1).name('Wall 2 width').onChange(updateWalls)
wallsFolder.add(wall2Parameters, 'height', 1, 30, 1).name('Wall 2 height').onChange(updateWalls)
wallsFolder.add(wall2Parameters, 'widthSegments', 1, 20, 1).name('Wall 2 segments').onChange(updateWalls)
wallsFolder.add(wall2Parameters, 'heightSegments', 1, 20, 1).name('Wall 2 segments').onChange(updateWalls)
wallsFolder.add(wall2.position, 'x', -10, 10, 0.1).name('Wall 2 X')
wallsFolder.add(wall2.position, 'y', -10, 10, 0.1).name('Wall 2 Y')
wallsFolder.add(wall2.position, 'z', -10, 10, 0.1).name('Wall 2 Z')
wallsFolder.add(wall2.rotation, 'x', -10, 10, 0.1).name('Wall 2 Rotate X')
wallsFolder.add(wall2.rotation, 'y', -10, 10, 0.1).name('Wall 2 Rotate Y')
wallsFolder.add(wall2.rotation, 'z', -10, 10, 0.1).name('Wall 2 Rotate Z')

//    Cube Geometry  
// =====================
let cubeAnimation = { rotateSpeed: 0.01 }
const cubeGeometry = new THREE.BoxGeometry()
const cubeMaterial = brassMaterial
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.set( -2, 1.8, -1.6 )
scene.add(cube)

cubeFolder.add(cube.position, 'x', -10, 10, 0.2).name('Cube X')
cubeFolder.add(cube.position, 'y', -10, 10, 0.2).name('Cube Y')
cubeFolder.add(cube.position, 'z', -10, 10, 0.2).name('Cube Z')
cubeFolder.add(cubeAnimation, 'rotateSpeed', 0, 0.3, 0.01).name('Cube Rotation Speed')
cubeFolder.add(cubeMaterial, 'wireframe').name('Wireframe')

function cubeAnimationLoop()
{
  cube.rotation.x += cubeAnimation.rotateSpeed;
  cube.rotation.y += cubeAnimation.rotateSpeed;
}

//    Torus Geometry  
// =====================
const torusParameters = {
  radius: 0.5,
  tube: 0.2,
  tubularSegments: 120,
  radialSegments: 18,
  rotateSpeed: 0.01
}
// Function to rebuild torus geometry
function updateTorus() {
  torus.geometry.dispose()
  torus.geometry = new THREE.TorusKnotGeometry(
    torusParameters.radius, 
    torusParameters.tube, 
    torusParameters.tubularSegments, 
    torusParameters.radialSegments
  )
}
const torusGeometry = new THREE.TorusKnotGeometry(torusParameters.radius, torusParameters.tube, torusParameters.tubularSegments, torusParameters.radialSegments)
const torusMaterial = glassMat
const torus = new THREE.Mesh(torusGeometry, torusMaterial)
torus.position.set( -2, 1.6, 2.6 )
scene.add(torus)

torusFolder.add(torusParameters, 'radius', 0, 5, 0.1).name('Radius').onChange(updateTorus)
torusFolder.add(torusParameters, 'tube', 0, 5, 0.1).name('Tube').onChange(updateTorus)
torusFolder.add(torusParameters, 'tubularSegments', 0, 120, 1).name('Tubular segments').onChange(updateTorus)
torusFolder.add(torusParameters, 'radialSegments', 0, 64, 1).name('Radial segments').onChange(updateTorus)
torusFolder.add(torus.position, 'x', -10, 10, 0.2).name('Torus X')
torusFolder.add(torus.position, 'y', -10, 10, 0.2).name('Torus Y')
torusFolder.add(torus.position, 'z', -10, 10, 0.2).name('Torus Z')
torusFolder.add(torus.rotation, 'x', -10, 10, 0.2).name('Rotate X')
torusFolder.add(torus.rotation, 'y', -10, 10, 0.2).name('Rotate Y')
torusFolder.add(torus.rotation, 'z', -10, 10, 0.2).name('Rotate Z')
torusFolder.add(torusMaterial, 'wireframe').name('Wireframe')

const top = 5, bottom = 0;
const amp = (top - bottom) / 2;
const mid = (top + bottom) / 2;
const speed = 1.5; // radians/sec
const clock = new THREE.Clock();

function torusAnimationLoop()
{
  //Rotate like the cube
  torus.rotation.x += torusParameters.rotateSpeed;
  torus.rotation.y += torusParameters.rotateSpeed;

  const t = clock.getElapsedTime();
  torus.position.y = mid + amp * Math.sin(t * speed);

}

//    Cone Geometry  
// =====================
const coneParameters = {
  radius: 0.7,
  height: 1.1,
  radialSegments: 32,
  heightSegments: 1,
  openEnded: false,
  thetaStart: 0,
  thetaLength: Math.PI * 2,
  speed: 0.001
}
// Function to rebuild torus geometry
function updateCone() {
  cone.geometry.dispose()
  cone.geometry = new THREE.ConeGeometry(
    coneParameters.radius,
    coneParameters.height,
    coneParameters.radialSegments,
    coneParameters.heightSegments,
    coneParameters.openEnded,
    coneParameters.thetaStart,
    coneParameters.thetaLength
  )
}
const coneGeometry = new THREE.ConeGeometry(
  coneParameters.radius,
  coneParameters.height,
  coneParameters.radialSegments,
  coneParameters.heightSegments,
  coneParameters.openEnded,
  coneParameters.thetaStart,
  coneParameters.thetaLength
)
const coneMaterial = greenMaterial
const cone = new THREE.Mesh(coneGeometry, coneMaterial)
scene.add( cone )

cone.position.set(1.8, 1.4, -2)
cone.rotation.set(-0.4, 0, 0.4)

coneFolder.add(coneParameters, 'radius', 0, 5, 0.1).name('Radius').onChange(updateCone)
coneFolder.add(coneParameters, 'height', 0, 5, 0.1).name('Height').onChange(updateCone)
coneFolder.add(coneParameters, 'radialSegments', 0, 120, 1).name('Radial segments').onChange(updateCone)
coneFolder.add(coneParameters, 'heightSegments', 0, 64, 1).name('Height segments').onChange(updateCone)
coneFolder.add(coneParameters, 'openEnded').name('Open ended').onChange(updateCone)
coneFolder.add(coneParameters, 'thetaStart', 0, 64, 1).name('Theta Start').onChange(updateCone)
coneFolder.add(coneParameters, 'thetaLength', 0, 64, 1).name('Theta length').onChange(updateCone)

coneFolder.add(cone.position, 'x', -10, 10, 0.2).name('cone X')
coneFolder.add(cone.position, 'y', -10, 10, 0.2).name('cone Y')
coneFolder.add(cone.position, 'z', -10, 10, 0.2).name('cone Z')
coneFolder.add(cone.rotation, 'x', -10, 10, 0.2).name('Rotate X')
coneFolder.add(cone.rotation, 'y', -10, 10, 0.2).name('Rotate Y')
coneFolder.add(cone.rotation, 'z', -10, 10, 0.2).name('Rotate Z')
coneFolder.add(coneMaterial, 'wireframe').name('Wireframe')

function coneAnimationLoop()
{
  cone.rotation.x += coneParameters.speed
  cone.rotation.y += coneParameters.speed
  cone.rotation.z += coneParameters.speed
}

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
    // Do something with the object
    intersects[0].object.material.color.set(0xff0000)
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
  cubeAnimationLoop()
  torusAnimationLoop()
  coneAnimationLoop()
  controls.update()
  renderer.render(scene, camera)
}
animate();