import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const gui = new dat.GUI()

/* 
Galaxy
*/
const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3

let geometry = null
let particlesMaterial = null
let points = null


const generateGalaxy = () => {

  if (points !== null) {
    geometry.dispose()
    particlesMaterial.dispose()
    scene.remove(points)
  }
  // console.log('generate the galaxy')
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3
    const radius = Math.random() * parameters.radius
    
    positions[i3] = radius
    positions[i3 + 1] = 0
    positions[i3 + 2] = 0
  }
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )
  particlesMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  // particlesMaterial.transparent = true
  // particlesMaterial.alphaMap = particleTexture
  // //设置贴图没有内容的部分透明 
  // particlesMaterial.alphaTest = 0.001
  // //不要遮挡场景内的其他物体
  // particlesMaterial.depthTest = false
  // //重叠部分会高亮 增加粒子数量时效果更明显
  // particlesMaterial.blending = THREE.AdditiveBlending
  // //改变vertexColor属性让颜色显色
  // particlesMaterial.vertexColors = true
  points = new THREE.Points(geometry, particlesMaterial)
  scene.add(points)
}
generateGalaxy()
gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
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

  // // Update objects
  // mesh.rotation.y = elapsedTime;

  // // Update camera
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * 5
  // camera.lookAt(mesh.position) // Should always come after updating the camera

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()