import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from "gsap"
import * as dat from 'dat.gui'

/* 
Texture
*/
// const image = new Image()
// const texture = new THREE.Texture(image)
// image.onload = () =>{
//   texture.needsUpdate = true
// }
// image.src = './public/textures/door/color.jpg'
const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load('./public/textures/door/color.jpg')
// const alphaTexture = textureLoader.load('./public/textures/door/alpha.jpg')
// const heightTexture = textureLoader.load('./public/textures/door/height.jpg')
// const roughnessTexture = textureLoader.load('./public/textures/door/roughness.jpg')
colorTexture.minFilter = THREE.NearestFilter



function spin(){
  gsap.to(mesh.rotation,{duration:1,y:10})
}
/* 
Debug
*/
const gui = new dat.GUI()
const parameters = {
  color:0xffff00,
  spin:()=>{
    gsap.to(mesh.rotation,{duration:1,y:mesh.rotation.y + 10})
  }
}
gui
  .addColor(parameters,'color')
  .onChange(()=>{
    material.color.set(parameters.color)
  })

gui
  .add(parameters,'spin')

console.log(THREE)
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3)
const material = new THREE.MeshBasicMaterial({
map:colorTexture
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Deug
gui
  .add(mesh.position, 'y')
  .min(-3)
  .max(3)
  .step(0.01)
  .name('高')

gui
  .add(mesh,'visible')

gui
  .add(material,'wireframe')

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.z = 3
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


// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()