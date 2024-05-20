import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

let shouldApplyAcceleration = false;
if (window.DeviceMotionEvent) {
  shouldApplyAcceleration = true;
} else {
  console.log("DeviceMotionEvent is not supported");
}

let alpha = 0,
  beta = 0,
  gamma = 0;
let initialCameraRotation = {
  x: camera.rotation.x,
  y: camera.rotation.y,
  z: camera.rotation.z,
};

if (shouldApplyAcceleration) {
  window.addEventListener(
    "devicemotion",
    (event) => {
      alpha = event.rotationRate.alpha;
      beta = event.rotationRate.beta;
      gamma = event.rotationRate.gamma;
    },
    true
  );
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  if (shouldApplyAcceleration) {
    camera.rotation.x = initialCameraRotation.x + (beta * Math.PI) / 180;
    camera.rotation.y = initialCameraRotation.y + (gamma * Math.PI) / 180;
    camera.rotation.z = initialCameraRotation.z + (alpha * Math.PI) / 180;
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
