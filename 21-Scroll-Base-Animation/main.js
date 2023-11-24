import * as THREE from 'three'
import * as dat from 'dat.gui'
import gsap from 'gsap'
/**
 * Debug
 */
const gui = new dat.GUI()
gui.hide()

const parameters = {
  materialColor: '#ffeded'
}

gui
  .addColor(parameters, 'materialColor')
  .onChange(
    () => {
      material.color.set(parameters.materialColor)
      particlesMaterial.color.set(parameters.materialColor)
    }
  )
/* 
Texture
*/
const texturesLoader = new THREE.TextureLoader()
const texture = texturesLoader.load('textures/gradients/3.jpg')
texture.magFilter = THREE.NearestFilter
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const objectsDistance = 4
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor })
material.gradientMap = texture
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  material
)
console.log(mesh1)
const mesh2 = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  material
)

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
)

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]

/* 
Particles
*/
const particlesCount = 300
const position = new Float32Array(particlesCount * 3)
for (let i = 0; i < particlesCount; i++) {
  position[i * 3 + 0] = (Math.random() - 0.5) * 10
  position[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance *sectionMeshes.length
  position[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
const particlesMaterial = new THREE.PointsMaterial(
  {
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
  }
)
const particles = new THREE.Points(geometry, particlesMaterial)
scene.add(particles)
/* 
Light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/* 
Scroll
*/
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / sizes.height)

  if(newSection!= currentSection){
    currentSection = newSection
    gsap.to(
      sectionMeshes[currentSection].rotation,{
        duration:1.5,
        ease:'power2.inOut',
        x:'+=6',
        y:'+=3',
        z:'+=1.5'
        

      }
    )
  }

  console.log(scrollY)
})

/* 
Cursor
*/
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
  console.log(cursor)
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime


  camera.position.y = -scrollY / sizes.height * objectsDistance

  const parallaxX = cursor.x * 0.5
  const parallaxY = -cursor.y * 0.5
  cameraGroup.position.x = (parallaxX - cameraGroup.position.x) * 50 * deltaTime
  cameraGroup.position.y = (parallaxY - cameraGroup.position.y) * 50 * deltaTime


  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.12
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()