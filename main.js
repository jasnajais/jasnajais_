const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Add a glowing Tech-like structure
const techGroup = new THREE.Group();

// Inner glowing core
const coreGeo = new THREE.OctahedronGeometry(4, 0);
const coreMat = new THREE.MeshStandardMaterial({ 
    color: 0x00f2fe, 
    wireframe: false,
    flatShading: true,
    transparent: true,
    opacity: 0.9
});
const core = new THREE.Mesh(coreGeo, coreMat);
techGroup.add(core);

// Outer wireframe structure
const wireGeo = new THREE.IcosahedronGeometry(7, 1);
const wireMat = new THREE.MeshStandardMaterial({ 
    color: 0x4facfe, 
    wireframe: true,
    transparent: true,
    opacity: 0.6
});
const wireShell = new THREE.Mesh(wireGeo, wireMat);
techGroup.add(wireShell);

// Data rings
const ringGeo1 = new THREE.TorusGeometry(10, 0.2, 16, 100);
const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
const ring1 = new THREE.Mesh(ringGeo1, ringMat);
ring1.rotation.x = Math.PI / 2;
techGroup.add(ring1);

const ringGeo2 = new THREE.TorusGeometry(12, 0.1, 16, 100);
const ring2 = new THREE.Mesh(ringGeo2, ringMat);
ring2.rotation.y = Math.PI / 3;
techGroup.add(ring2);

// Position it firmly on the right side of the screen
techGroup.position.set(20, 0, -10);

scene.add(techGroup);

// Add Interactive Particles (Stars)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    // Spread particles across the screen
    posArray[i] = (Math.random() - 0.5) * 150;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 10);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(pointLight, ambientLight);

// Connect scroll events to move camera / objects
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    
    // Rotate object on scroll
    techGroup.rotation.x += 0.05;
    techGroup.rotation.y += 0.075;
    techGroup.rotation.z += 0.05;

    // Move camera on scroll
    camera.position.z = t * -0.01 + 30;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera;
moveCamera();

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant rotation of main object
    techGroup.rotation.x -= 0.003;
    techGroup.rotation.y -= 0.003;

    // Subtle particle movement
    particlesMesh.rotation.y = -elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Mouse movement effect
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    techGroup.rotation.y += 0.05 * (targetX - techGroup.rotation.y);
    techGroup.rotation.x += 0.05 * (targetY - techGroup.rotation.x);

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
