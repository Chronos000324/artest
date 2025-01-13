// Import necessary libraries and functions
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
import { MindARThree } from 'https://cdn.jsdelivr.net/npm/mind-ar@1.1.5/dist/mindar-image-three.prod.js';
import { loadGLTF } from './libs/loader.js';
// Function to initialize MindARThree instance
const initializeMindAR = () => {
  return new MindARThree({
    container: document.body,
    imageTargetSrc: './assets/targets/course-banner.mind',
  });
};

// Function to set up lighting for the scene
const setupLighting = (scene) => {
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);
};

// Function to load and configure a 3D model
const loadGLTFModel = async (url, scale, position) => {
  const loader = new THREE.GLTFLoader();
  const model = await loader.loadAsync(url);
  model.scene.scale.set(scale.x, scale.y, scale.z);
  model.scene.position.set(position.x, position.y, position.z);
  return model.scene;
};

// Function to set up anchors
const setupAnchor = (mindarThree, anchorIndex, model) => {
  const anchor = mindarThree.addAnchor(anchorIndex);
  anchor.group.add(model);
};

// Function to start rendering loop
const startRenderingLoop = (renderer, scene, camera) => {
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    renderer.render(scene, camera);
  });
};

// Main function to start the AR experience
document.addEventListener('DOMContentLoaded', async () => {
  const mindarThree = initializeMindAR();
  const { renderer, scene, camera } = mindarThree;

  setupLighting(scene);

  // Load models
  const model1 = await loadGLTFModel('./assets/models/RobotExpressive.glb', { x: 0.5, y: 0.5, z: 0.5 }, { x: 0, y: -0.4, z: 0 });

  // Set up anchors
  setupAnchor(mindarThree, 0, model1);

  // Start MindAR and rendering loop
  await mindarThree.start();
  startRenderingLoop(renderer, scene, camera);
});
