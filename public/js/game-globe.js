// imports 
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlay = document.getElementById("overlay")
const modal = document.getElementById("modal")
const container = document.getElementById("game-modal-body")
const width = modal.offsetWidth
const height = modal.offsetHeight


// creating scene, camera, renderer
const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
    )

const renderer = new THREE.WebGLRenderer({
    antialias: true
})

renderer.setSize(width, height)
//renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio) // cleans up image, better quality
container.appendChild(renderer.domElement)


// light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8)
scene.add(directionalLight)
directionalLight.position.set(0, 50, 0)


// create a sphere
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(3,50,50),
    new THREE.MeshBasicMaterial({
        //color: 0x2266EE
        map: new THREE.TextureLoader().load('./img/Globe.jpeg') // jpg is "wrapped" around the sphere
    })
)
sphere.userData.globe = true
sphere.userData.name = "Globe"
scene.add(sphere)

camera.position.z = 6

// helper ( draws axes)
// const helper = new THREE.AxesHelper(5)
// scene.add(helper)


// controls 
const controls = new OrbitControls(camera, renderer.domElement)
controls.maxPolarAngle = 2 * Math.PI / 3
controls.minPolarAngle = Math.PI / 3
controls.enableDamping = true
controls.enableZoom = false;
controls.enablePan = false

// add marker to clicked position
const targetGeometry = new THREE.SphereGeometry( 0.0125 )
const targetMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
let target = new THREE.Mesh( targetGeometry, targetMaterial )
scene.add( target )

// mouse click functionality
const mouse = new THREE.Vector2()
const raycaster = new THREE.Raycaster()

function onWindowResize()
{
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
}

window.addEventListener( 'resize', onWindowResize );

window.addEventListener( 'mousedown', (e) => {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1
	mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1
    raycaster.setFromCamera( mouse, camera )
    const intersects = raycaster.intersectObjects( scene.children, false )
    console.log(intersects)
    if (intersects.length > 0)
    {
        for (let i = 0; i < intersects.length; i++)
        {
            if (intersects[i].object.userData.globe)
            {
                console.log("Globe clicked index = " + i)
                target.position.set(intersects[i].point.x, intersects[i].point.y, intersects[i].point.z)
                convertToLatLong(intersects[i].point.x, intersects[i].point.y, intersects[i].point.z)
            }
        }
    }
    
})

const markLocation = () =>
{
    
}

const convertToLatLong = (x, y ,z) =>
{
    const r = 3
    const lat = 90 - (Math.acos(y / r) * 180 / Math.PI)
    let long
    const firstLong = (((270 + (Math.atan2(x, z) * 180 / Math.PI)) % 360) - 180)
    if (firstLong < 0)
    {
        long = firstLong + 180 
    }
    else if (firstLong > 0)
    {
        long = firstLong - 180
    }
    //console.log(lat + " " + long)
}

// establishing the "main" function or entry point into file
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    controls.update()
}

// calling entry point
animate()
//console.log(scene.children)