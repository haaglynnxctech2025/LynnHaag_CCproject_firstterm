import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "lil-gui";

/* ---------------- GUI ---------------- */
const gui = new GUI();

/* ---------------- SCENE ---------------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf5f5f5);

/* ---------------- CAMERA ---------------- */
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  20
);
camera.position.set(0, 1.2, 4);

/* ---------------- RENDERER ---------------- */
const canvas = document.querySelector("#canvasThree");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.physicallyCorrectLights = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/* ---------------- CONTROLS ---------------- */
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

/* ---------------- FLOOR ---------------- */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);

/* ---------------- OBJECTS ---------------- */

// Cube
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x0077ff,
  roughness: 0.25,
  metalness: 0.3,
});

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 0.7, 0.7),
  cubeMaterial
);
cube.position.set(-1.2, 0, 0);
cube.castShadow = true;
scene.add(cube);

// TorusKnot
const knotMaterial = new THREE.MeshStandardMaterial({
  color: 0x8844ff,
  roughness: 0.2,
  metalness: 0.6,
});

const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.4, 0.12, 150, 32),
  knotMaterial
);
knot.position.set(1.2, 0, 0);
knot.castShadow = true;
scene.add(knot);

/* ---------------- LIGHTS ---------------- */

// KEY LIGHT
const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(3, 4, 3);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.radius = 4;
scene.add(keyLight);

// FILL LIGHT
const fillLight = new THREE.DirectionalLight(0xffffff, 1);
fillLight.position.set(-3, 2, 2);
scene.add(fillLight);

// RIM LIGHT (GLOW)
const rimLight = new THREE.DirectionalLight(0xffffff, 2);
rimLight.position.set(-2, 3, -3);
scene.add(rimLight);

// SOFT AMBIENT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

/* ---------------- GUI CONTROLS ---------------- */

const lightFolder = gui.addFolder("Lights");
lightFolder.add(keyLight, "intensity", 0, 5, 0.01);
lightFolder.add(fillLight, "intensity", 0, 3, 0.01);
lightFolder.add(rimLight, "intensity", 0, 5, 0.01);

const rendererFolder = gui.addFolder("Renderer");
rendererFolder.add(renderer, "toneMappingExposure", 0.5, 2, 0.01);

/* ---------------- ANIMATION ---------------- */

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  knot.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

/* ---------------- RESIZE ---------------- */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
