import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { MindARThree } from 'https://cdn.jsdelivr.net/npm/mind-ar@1.1.5/dist/mindar-image-three.prod.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';

document.addEventListener('DOMContentLoaded', async () => {
  const mindarThree = new MindARThree({
    container: document.body,
    imageTargetSrc: './assets/targets/course-banner.mind', // Ubah ke file target-mu
  });

  const { renderer, scene, camera } = mindarThree;

  // Tambahkan pencahayaan
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  scene.add(light);

  // Muat model GLTF
  const loader = new GLTFLoader();
  loader.load('./assets/models/RobotExpressive.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, -0.4, 0);

    // Tambahkan model ke anchor
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(model);
  });

  // Mulai MindAR
  await mindarThree.start();

  // Animasi loop
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
});
