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

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Load the GLB model
const loader = new GLTFLoader();
let mixer, model;
loader.load(
	"./assets/models/arcane_jester_black_x-suit_3d_model/scene.gltf",
	function (gltf) {
		model = gltf.scene;
		model.scale.set(1, 1, 1);
		model.position.y = 1.06;
		if (window.innerWidth < 768) model.position.x = 0;
		else {
			model.position.x = 0.5; // Adjusted to 0.5 for better visibility on large screens
		}

		// Ensure textures load with proper filtering
		model.traverse(function (node) {
			if (node.isMesh) {
				node.castShadow = true;
				if (node.material.map) {
					node.material.map.anisotropy =
						renderer.capabilities.getMaxAnisotropy();
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

	// Adjust model position based on screen size
	if (model) {
		if (window.innerWidth < 768) {
			model.position.x = 0; // Center the model on smaller screens
		} else {
			model.position.x = 0.5; // Original position on larger screens
		}
	}

	console.log(
		"Width:",
		width,
		"Height:",
		height,
		"Aspect Ratio:",
		camera.aspect
	);
});

// Ensure initial render works on small screens
window.dispatchEvent(new Event("resize"));
