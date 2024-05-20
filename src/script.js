import * as THREE from "three";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

let shouldApplyDeviceOrientation = false;
if (window.DeviceOrientationEvent) {
  shouldApplyDeviceOrientation = true;
} else {
  console.log("DeviceOrientationEvent is not supported");
}

let alpha = 0,
  beta = 0,
  gamma = 0;

if (shouldApplyDeviceOrientation) {
  window.addEventListener(
    "deviceorientation",
    (event) => {
      alpha = event.alpha;
      beta = event.beta;
      gamma = event.gamma;
    },
    true
  );
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  if (shouldApplyDeviceOrientation) {
    camera.rotation.x = (beta * Math.PI) / 180 - Math.PI / 2;
    camera.rotation.y = (alpha * Math.PI) / 180;
    camera.rotation.z = (alpha * Math.PI) / 180;
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
