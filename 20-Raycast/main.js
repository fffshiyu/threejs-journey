import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


console.log(THREE)
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)



// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0)
// rayDirection.normalize()

// raycaster.set(rayOrigin, rayDirection)

// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)

// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

/**
 * Mouse
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX / sizes.width * 2 - 1
  mouse.y = - (event.clientY / sizes.height * 2 - 1)
})

window.addEventListener('click', () => {
  // console.log('click');
  if(currentIntersect){
    // console.log('click on sphere');
    switch (currentIntersect.object) {
      case object1:
        console.log('object 1 clicked')
        break
      case object2:
        console.log('object 2 clicked')
        break
      case object3:
        console.log('object 3 clicked')
        break
    }
  }
})

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.z = 3
scene.add(camera)

window.addEventListener('resize', () => {
  console.log("window has been resized")
  //update size
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  //update camera
  camera.aspect = sizes.width / sizes.height+
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


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()
let currentIntersect = null
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

 // Animate objects
 object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
 object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
 object3.position.y = Math.sin(elapsedTime * 0.5) * 1.5

 // Cast a ray
 raycaster.setFromCamera(mouse, camera)

 const objectsToTest = [object1, object2, object3]
 const intersects = raycaster.intersectObjects(objectsToTest)
 // console.log(intersects.length);

 for(const object of objectsToTest) {
   object.material.color.set('#ff0000')
 }

 for(const intersect of intersects) {
   intersect.object.material.color.set('#0000ff')
 }

 if(intersects.length){
   // console.log('something hovered')
   if(currentIntersect === null){
     console.log('mouse enter');
   }
   currentIntersect = intersects[0]
 } else {
   // console.log('nothing hovered')
   if(currentIntersect){
     console.log('mouse leave');
   }
   currentIntersect = null
 }
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()