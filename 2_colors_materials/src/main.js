// ISC
// Imports 
import * as THREE from 'three'
import { GUI } from 'lil-gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Lil' goo 
const gui = new GUI()
const sceneFolder = gui.addFolder('Scene').open()
const geometryFolder = gui.addFolder('Geometry & Objects').open()
const lightingFolder = gui.addFolder('Lighting').open()
const otherFolder = gui.addFolder('Other').open()
const floorFolder = geometryFolder.addFolder('Floor').open()
const cubeFolder = geometryFolder.addFolder('Cube').open()
const torusFolder = geometryFolder.addFolder('Torus').open()


// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('#8bb388')

sceneFolder.addColor(scene, 'background').name('Scene Background Color')

//Axes and other helpers
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
otherFolder.add(axesHelper, 'visible').name('Enable Axes helper')

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(2, 2, 5)

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


// Lights
const ambientLight = new THREE.AmbientLight(0xababab, 1)
scene.add(ambientLight)
lightingFolder.addColor(ambientLight, 'color').name('Ambient Light Color')
lightingFolder.add(ambientLight, 'intensity', 0, 5, 0.1).name('Ambient Light Intensity')

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2)
directionalLight.position.set(2,2,7)
scene.add(directionalLight)
lightingFolder.addColor(directionalLight, 'color').name('Directional Light Color')
lightingFolder.add(directionalLight, 'intensity', 0, 5, 0.1).name('Directional Light Intensity')

// GRA
// ====== Geometry ========
//     Floor Geometry
const floorParameters = {
  width: 8,
  height: 15,
  widthSegments: 5,
  heightSegments: 5
}
let floorGeometry = new THREE.PlaneGeometry(floorParameters.width, floorParameters.height, floorParameters.widthSegments, floorParameters.heightSegments)
const floorMaterial = new THREE.MeshStandardMaterial({ color: '#0077ff' })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = - Math.PI / 2
scene.add(floor)

// Function to rebuild geometry
function updateFloor() {
  floor.geometry.dispose(); // free memory
  floor.geometry = new THREE.PlaneGeometry(
    floorParameters.width,
    floorParameters.height,
    floorParameters.widthSegments,
    floorParameters.heightSegments
  );
}

floorFolder.add(floorMaterial, 'wireframe').name('Floor Wireframe')
floorFolder.add(floorParameters, 'width', 1, 30, 1).name('Floor width').onChange(updateFloor)
floorFolder.add(floorParameters, 'height', 1, 30, 1).name('Floor height').onChange(updateFloor)
floorFolder.add(floorParameters, 'widthSegments', 1, 20, 1).name('Width segments').onChange(updateFloor)
floorFolder.add(floorParameters, 'heightSegments', 1, 20, 1).name('Height segments').onChange(updateFloor)


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
const torusMaterial = bronzeMaterial
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
  controls.update()
  renderer.render(scene, camera)
}
animate();