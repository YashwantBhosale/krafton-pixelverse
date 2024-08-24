import * as THREE from "https://cdn.skypack.dev/three@0.133.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.133.0/examples/jsm/loaders/GLTFLoader.js";

// Basic setup
const scene = new THREE.Scene();
const container = document.getElementById("container");
const camera = new THREE.PerspectiveCamera(
  35,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Update camera aspect ratio and projection matrix
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Ground plane (optional, you can remove if not needed)
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -7;
ground.receiveShadow = true;

const hologramShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    resolution: { value: new THREE.Vector2() },
    tDiffuse: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec2 vUv;
    void main() {
      vec2 p = vUv;
      float a = sin(time * 0.5) * 0.5 + 0.5;
      float b = cos(time * 0.8) * 0.5 + 0.5;
      gl_FragColor = vec4(vec3(a, b, a * b), 0.5);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
});

// Load the GLB model
const loader = new GLTFLoader();
let mixer, model;
loader.load(
  "./assets/models/arcane_jester_black_x-suit_3d_model/scene.gltf",
  function (gltf) {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.y = 1.06;
    model.position.x = 0.5 // Adjusted to 0 for better visibility

    // Ensure textures load with proper filtering
    model.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        if (node.material.map) {
          node.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }
        node.material.needsUpdate = true;
      }
    });

    scene.add(model);

    // Set up animation mixer if needed
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    // Camera positioning
    camera.position.z = 5;
    camera.position.y = 2; // Slightly raised camera position

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      if (mixer) mixer.update(0.01);
      renderer.render(scene, camera);
    }
    animate();
  },
  undefined,
  function (error) {
    console.error("An error occurred:", error);
  }
);

// Handle window resize
window.addEventListener("resize", function () {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

