import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


console.log(THREE)
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* 
Texture
*/
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/10.png')

// Particles
// const particlesGeometry = new THREE.SphereGeometry(1,32,32)
const particlesGeometry = new THREE.BufferGeometry
const count = 10000
const position = new Float32Array(count *3)
const color = new Float32Array(count *3)
for (let i=0;i<count *3 ;i++){
  position[i] = (Math.random()-0.5)*10
  //position的值是从-5到5
  color[i] = Math.random()
}
particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(position,3)
)
particlesGeometry.setAttribute(
  'color',
  new THREE.BufferAttribute(color,3)
)
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 0.1
particlesMaterial.sizeAttenuation = true
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
//设置贴图没有内容的部分透明 
particlesMaterial.alphaTest = 0.001
//不要遮挡场景内的其他物体
particlesMaterial.depthTest = false
//重叠部分会高亮 增加粒子数量时效果更明显
particlesMaterial.blending = THREE.AdditiveBlending
//改变vertexColor属性让颜色显色
particlesMaterial.vertexColors =true
const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add(particles)

// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial()

// )
// scene.add(cube)

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

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const x = particlesGeometry.attributes.position.array[i3 + 0]
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
  }
  particlesGeometry.attributes.position.needsUpdate = true
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()