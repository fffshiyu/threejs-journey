
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/* 
Debug */
const gui = new dat.GUI()
gui.hide()
/* 
Texture
*/
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const colorTexture = textureLoader.load('./public/textures/door/color.jpg')
const alphaTexture = textureLoader.load('./public/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('./public/textures/door/height.jpg')
const roughnessTexture = textureLoader.load('./public/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('./public/textures/matcaps/2.png')
const grandientTexture = textureLoader.load('./public/textures/grandients/5.jpg')
const metalnessTexture = textureLoader.load('./public/textures/door/metalness.jpg')
const ambientOclusionTexture = textureLoader.load('./public/textures/door/ambientOcclusion.jpg')
const normalTexture = textureLoader.load('./public/textures/door/normal.jpg')
grandientTexture.minFilter = THREE.NearestFilter
grandientTexture.magFilter = THREE.NearestFilter
grandientTexture.generateMipmaps = false

/**
 * Textures
 */
const bakedShadow = textureLoader.load('./public/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')



// Canvas

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const material = new THREE.MeshBasicMaterial({
//  map:colorTexture
// })
// const material = new THREE.MeshBasicMaterial
// material.map= colorTexture
// material.transparent = true
// material.alphaMap= alphaTexture
// const material = new THREE.MeshNormalMaterial()
// material.flatShading = true

// const material =new THREE.MeshMatcapMaterial()
// material.matcap =matcapTexture

// const material = new THREE.MeshPhongMaterial()
// material.shininess =100
// material.specular = new THREE.Color(0xffffff)

// const material = new THREE.MeshToonMaterial()
// material.grandientTexture= grandientTexture

// const material = new THREE.MeshStandardMaterial()
// material.metalness = 0.7
// material.roughness = 0.2

// material.displacementMap = heightTexture


// gui.add(material,'metalness').min(0).max(1).step(0.0001)
// gui.add(material,'roughness').min(0).max(1).step(0.0001)
// gui.add(material,'aoMapIntensity').min(1).max(10).step(1)


// material.map = colorTexture
// material.aoMap = ambientOclusionTexture
// material.aoMapIntensity = 1
// material.displacementScale = 0.05
// material.metalnessMap = metalnessTexture
// material.roughness = roughnessTexture
// material.normalMap = normalTexture
// material.normalScale.set(0.5,0.5)
// material.transparent = true
// material.alphaMap = alphaTexture
// material.ambientOclusionTexture=ambientOclusionTexture
// const environmentMapTexture = cubeTextureLoader.load([
//   './public/textures/environmentMaps/0/px.jpg',
//   './public/textures/environmentMaps/0/nx.jpg',
//   './public/textures/environmentMaps/0/py.jpg',
//   './public/textures/environmentMaps/0/ny.jpg',
//   './public/textures/environmentMaps/0/pz.jpg',
//   './public/textures/environmentMaps/0/nz.jpg',
  
// ])
// material.envMap = environmentMapTexture
const material =new THREE.MeshMatcapMaterial()
material.matcap =matcapTexture

//Objects
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
)
sphere.position.y =0.5




const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  material
)

plane.position.y =-0.5
plane.rotation.x = - Math.PI * 0.5
const sphereShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: simpleShadow
  })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01

scene.add(sphere, sphereShadow, plane)


scene.add( sphere,  plane)
// sphere.castShadow = true
// sphere.receiveShadow = true
// sphere.castShadow = true
// sphere.receiveShadow = true
// plane.castShadow = true
// plane.receiveShadow = true
// torus.castShadow = true
// torus.receiveShadow = true


/* 
Lights
*/
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
// const directionalLight = new THREE.DirectionalLight(0xffffff,1)
// scene.add(directionalLight)
// directionalLight.position.set(1, 0.25, 0)


const spotLight = new THREE.SpotLight(0xffffff, 0.2, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
spotLight.target.position.x = - 0.75
scene.add(spotLight.target)

// spotLight.shadow.camera.near = 1
// spotLight.shadow.camera.far = 6



// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.z = 3
camera.position.y = 3
scene.add(camera)

window.addEventListener('resize', () => {
  console.log("window has been resized")
  //update size
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  //update remderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () => {
  const fullscreenElement = document.fullscreenElement || document.webkitRequestFullscreen
  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    }
    else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  }// console.log('DBCLICK')
  else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
    console.log('leave fullscreen')
    document.exitFullscreen()
  }

})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.shadowMap.enabled = true

// Animate
const clock = new THREE.Clock()

const tick = () => {
 
  const elapsedTime = clock.getElapsedTime()

    // Update the sphere
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update the shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()