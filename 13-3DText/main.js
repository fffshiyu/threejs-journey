import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


/* 
Font
*/
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new TextGeometry(
      'KIKI.LIAO',
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)
    textGeometry.center()
    // const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    // const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    const geometry = new THREE.ExtrudeGeometry(createHeartShape(0.006), {
      depth: 0.001,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1
  });
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
    for (let i = 0; i < 400; i++) {
      const donut =  new THREE.Mesh(geometry, material);
      donut.rotation.x = Math.random() * Math.PI
      donut.rotation.y = Math.random() * Math.PI
      donut.position.x = (Math.random() - 0.5) * 10
      donut.position.y = (Math.random() - 0.5) * 10
      donut.position.z = (Math.random() - 0.5) * 10
      const scale = Math.random()
      donut.scale.set(scale, scale, scale)
      scene.add(donut)
    }

  }
)

function createHeartShape(scale = 1) {
  const shape = new THREE.Shape();
  
  shape.moveTo(25 * scale, 25 * scale);
  shape.bezierCurveTo(25 * scale, 25 * scale, 20 * scale, 0 * scale, 0 * scale, 0 * scale);
  shape.bezierCurveTo(-30 * scale, 0 * scale, -30 * scale, 35 * scale, -30 * scale, 35 * scale);
  shape.bezierCurveTo(-30 * scale, 55 * scale, -10 * scale, 77 * scale, 25 * scale, 95 * scale);
  shape.bezierCurveTo(60 * scale, 77 * scale, 80 * scale, 55 * scale, 80 * scale, 35 * scale);
  shape.bezierCurveTo(80 * scale, 35 * scale, 80 * scale, 0 * scale, 50 * scale, 0 * scale);
  shape.bezierCurveTo(35 * scale, 0 * scale, 25 * scale, 25 * scale, 25 * scale, 25 * scale);

  return shape;
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x89CFF0);
scene.fog = new THREE.Fog(0x89CFF0, 1, 11)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.z = 2
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
controls.autoRotate= true
controls.autoRotateSpeed = 0.1


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