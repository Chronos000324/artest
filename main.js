// Import necessary functions and libraries
import * as THREE from './libs/three.js-r132/build/three.module.js';
import { MindARThree } from './libs/mindar/mindar-image-three.prod.js';
import { loadGLTF } from './libs/loader.js';

// Function to initialize MindARThree instance
const initializeMindAR = () => {
  return new MindARThree({
    container: document.body,
    imageTargetSrc: './assets/targets/course-banner.mind', // Path to your AR marker file
  });
};

// Function to set up lighting for the scene
const setupLighting = (scene) => {
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);
};

// Function to load and configure a 3D model
const loadAndConfigureModel = async (path, scale, position) => {
  const model = await loadGLTF(path);
  model.scene.scale.set(scale.x, scale.y, scale.z);
  model.scene.position.set(position.x, position.y, position.z);

  // If the model has animations, set up an animation mixer
  if (model.animations && model.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(model.scene);
    const action = mixer.clipAction(model.animations[0]);
    action.play();
    model.mixer = mixer;
  }

  return model;
};

// Function to set up the anchor with the model
const setupAnchor = (mindarThree, anchorIndex, model) => {
  const anchor = mindarThree.addAnchor(anchorIndex);
  anchor.group.add(model.scene);
};

// Function to start rendering loop
const startRenderingLoop = (renderer, scene, camera, models) => {
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const delta = clock.getDelta();
    models.forEach((model) => {
      if (model.mixer) {
        model.mixer.update(delta);
      }
    });
    renderer.render(scene, camera);
  });
};

// Main function to start the AR experience
document.addEventListener('DOMContentLoaded', () => {
  const start = async () => {
    const mindarThree = initializeMindAR();
    const { renderer, scene, camera } = mindarThree;

    // Add lighting
    setupLighting(scene);

    // Load 3D models and configure them
    const robotModel = await loadAndConfigureModel(
      './assets/models/RobotExpressive.glb', // Path to the 3D model file
      { x: 0.5, y: 0.5, z: 0.5 },           // Scale
      { x: 0, y: -0.4, z: 0 }              // Position
    );

    // Set up an anchor for the robot model
    setupAnchor(mindarThree, 0, robotModel);

    // Start the AR session and rendering loop
    await mindarThree.start();
    startRenderingLoop(renderer, scene, camera, [robotModel]);
  };

  start();
});
