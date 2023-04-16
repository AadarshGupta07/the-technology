import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Pane } from 'tweakpane';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import gsap from 'gsap'
/**
 * Base
 */
// GLTF loader
const gltfLoader = new GLTFLoader()


// Select the loader element
const loaderr = document.getElementById('loader');

// Hide the loader when the content is fully loaded
window.addEventListener('load', () => {
  loaderr.style.display = 'none';
});

// Show the loader when the DOM is loading
document.addEventListener('DOMContentLoaded', () => {
  loaderr.style.display = 'block';
});


// Debug
const pane = new Pane();
pane.registerPlugin(EssentialsPlugin);

const fpsGraph = pane.addBlade({
    view: 'fpsgraph',
    label: 'fpsgraph',
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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

/***
 *  Lights
 */
// Ambient Light
const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 0.5
scene.add(camera)

// const camera = new THREE.OrthographicCamera( -0.8, 0.8, 0.8, -0.8 );
// scene.add( camera );

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.dampingFactor = 0.04
// controls.minDistance = 5
// controls.maxDistance = 60
// controls.enableRotate = true
// controls.enableZoom = true
// controls.maxPolarAngle = Math.PI /2.5


/**
 *  Model
 */

// // Texture Loader
// const textureLoader = new THREE.TextureLoader()
// const bakedTexture = textureLoader.load('any.jpg')
// bakedTexture.flipY = false
// bakedTexture.encoding = THREE.sRGBEncoding


// // Material
// const bakedMaterial = new THREE.MeshBasicMaterial({map: bakedTexture})

// let model;
// gltfLoader.load(
//     'DeskTop.glb',
//     (gltf) => {

//         //for singular object scene only
//         // gltf.scene.traverse((child) => {
//         //     child.material = bakedMaterial
//         // })

//         // Target's specific object only to apply textures
//         screenMesh = gltf.scene.children.find((child) => {
//             return child.name === 'any'
//         })

//         model = gltf.scene
//         model.scale.set(0.5, 0.5, 0.5) 

//         model = gltf.scene;
//         scene.add(model)
//     }
// )

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x18142c, 1);


/**
 *  Gui 
 */
const params = { color: '#ffffff' };

// add a folder for the scene background color
const folder = pane.addFolder({ title: 'Background Color' });

folder.addInput(params, 'color').on('change', () => {
    const color = new THREE.Color(params.color);
    scene.background = color;
});

// For Tweaking Numbers

// // add a number input to the pane
// const params2 = {value: 1};
// const numberInput = pane.addInput(params2, 'value', {
//   min: 1,
//   max: 5,
//   step: 0.001,
// });

// // update the number value when the input value changes
// numberInput.on('change', () => {
//   console.log(`Number value updated to ${params2.value}`);
// });

//

let sphereGeometry = new THREE.SphereGeometry(1,100,100)
let sphereMaterial = new THREE.PointsMaterial({
    size: 0.001,
    sizeAttenuation: true,
    transparent: true,
    // alphaMap: Texture,
    depthWrite:false,
    blending: THREE.AdditiveBlending,
    // vertexColors: true,
    color: 'aqua',
})

let sphere1 = new THREE.Points(sphereGeometry, sphereMaterial)
let sphere2 = sphere1.clone()

sphere1.position.x = -1.1
sphere2.position.x = 1.1

let group = new THREE.Group();
group.add(sphere1, sphere2);

scene.add(group);

group.rotation.z = Math.PI / 2;
group.scale.x = 0.8;

let nextBtn = document.querySelector('.btn-next');
let previousBtn = document.querySelector('.btn-previous');
let counter =document.getElementById('counter')

nextBtn.addEventListener('click', () => {
  gsap.to(group.rotation, { z: Math.PI, duration: 1 }); // use GSAP to animate the rotation
  counter.innerHTML = '02'
});

previousBtn.addEventListener('click', () => {
  gsap.to(group.rotation, { z: Math.PI/2, duration: 1 }); // use GSAP to animate the rotation
  counter.innerHTML = '01'
});


/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    fpsGraph.begin()

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // if(model){

    //     // group.rotation.y = elapsedTime 
    // }

    // Update controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    fpsGraph.end()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()