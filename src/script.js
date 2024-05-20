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

let accelerometer;
let accelerationX = 0,
  accelerationY = 0,
  accelerationZ = 0;
let cameraPosition = new THREE.Vector3(0, 0, 3);

if (window.Accelerometer) {
  accelerometer = new Accelerometer({ frequency: 60 });
  accelerometer.addEventListener("reading", () => {
    accelerationX = accelerometer.x;
    accelerationY = accelerometer.y;
    accelerationZ = accelerometer.z;
  });
  accelerometer.start();
} else {
  console.log("Accelerometer is not supported");
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  if (accelerometer) {
    // Применяем смещение камеры на основе данных акселерометра
    cameraPosition.x += accelerationX * elapsedTime;
    cameraPosition.y += accelerationY * elapsedTime;
    cameraPosition.z += accelerationZ * elapsedTime;

    camera.position.copy(cameraPosition);
  }

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
