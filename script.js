
/* ==========================================
   STUDENTVERSE - REAL 3D COSMIC EXPERIENCE
   Three.js + GSAP
========================================== */

const canvas = document.getElementById("universe");

if (!canvas || typeof THREE === "undefined") {
    console.error("Three.js or universe canvas not found.");
} else {

    // ------------------------------
    // 1. SCENE AND CAMERA
    // ------------------------------

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(0, 0, 14);

    // ------------------------------
    // 2. WEBGL RENDERER
    // ------------------------------

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputEncoding = THREE.sRGBEncoding;

    // ------------------------------
    // 3. PLANET GROUP
    // ------------------------------

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const isMobile = window.innerWidth < 700;

    planetGroup.position.set(
        isMobile ? 0 : 3.8,
        isMobile ? -2.8 : 0.2,
        0
    );

    const planetScale = isMobile ? 0.68 : 1;

    planetGroup.scale.setScalar(planetScale);

    // ------------------------------
    // 4. CREATE PLANET TEXTURE
    // ------------------------------

    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 1024;
    textureCanvas.height = 512;

    const ctx = textureCanvas.getContext("2d");

    const gradient = ctx.createLinearGradient(
        0, 0, 1024, 512
    );

    gradient.addColorStop(0, "#17104e");
    gradient.addColorStop(0.3, "#5735a5");
    gradient.addColorStop(0.6, "#a45acb");
    gradient.addColorStop(1, "#101c55");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Planet surface waves
    for (let i = 0; i < 110; i++) {

        const y = Math.random() * 512;
        const height = Math.random() * 18 + 2;

        ctx.fillStyle = i % 2 === 0
            ? "rgba(180,130,255,0.15)"
            : "rgba(30,70,160,0.18)";

        ctx.fillRect(0, y, 1024, height);
    }

    // Surface spots
    for (let i = 0; i < 90; i++) {

        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = Math.random() * 15 + 2;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);

        ctx.fillStyle = "rgba(210,170,255,0.15)";
        ctx.fill();
    }

    const planetTexture = new THREE.CanvasTexture(textureCanvas);

    // ------------------------------
    // 5. MAIN PLANET
    // ------------------------------

    const planetGeometry = new THREE.SphereGeometry(
        3,
        96,
        96
    );

   
const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
    color: 0xaaaaff,
    roughness: 0.9,
    metalness: 0.05,
    emissive: 0x160044,
    emissiveIntensity: 0.18
});


    const planet = new THREE.Mesh(
        planetGeometry,
        planetMaterial
    );

    planetGroup.add(planet);

    // ------------------------------
    // 6. PLANET ATMOSPHERE
    // ------------------------------

    const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(3.12, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0x9d6aff,
            transparent: true,
            opacity: 0.09,
            side: THREE.BackSide
        })
    );

    planetGroup.add(atmosphere);

    // ------------------------------
    // 7. PLANET RINGS
    // ------------------------------

    const ringColors = [
        0xb99aff,
        0x6d8cff,
        0xe1a8ff
    ];

    ringColors.forEach((color, index) => {

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(
                4.1 + index * 0.42,
                0.025 + index * 0.012,
                3,
                160
            ),

            new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7 - index * 0.12
            })
        );

        ring.rotation.x = 1.15;
        ring.rotation.y = 0.12;

        planetGroup.add(ring);

    });

    // ------------------------------
    // 8. LIGHTING
    // ------------------------------

    scene.add(
    new THREE.AmbientLight(0xffffff, 0.35)
);

    const purpleLight = new THREE.PointLight(
    0x9a5aff,
    55,
    100
);

const blueLight = new THREE.PointLight(
    0x448bff,
    35,
    100
);

    // ------------------------------
    // 9. ORBITING MOON
    // ------------------------------

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 40, 40),

        new THREE.MeshStandardMaterial({
            color: 0xb8a9ff,
            roughness: 0.8,
            metalness: 0.1,
            emissive: 0x31205c,
            emissiveIntensity: 0.3
        })
    );

    scene.add(moon);

    // ------------------------------
    // 10. STAR FIELD
    // ------------------------------

    const starCount = isMobile ? 900 : 2200;

    const starPositions = new Float32Array(
        starCount * 3
    );

    const starSizes = [];

    for (let i = 0; i < starCount; i++) {

        starPositions[i * 3] =
            (Math.random() - 0.5) * 180;

        starPositions[i * 3 + 1] =
            (Math.random() - 0.5) * 100;

        starPositions[i * 3 + 2] =
            (Math.random() - 0.5) * 120;

        starSizes.push(
            Math.random() * 0.02 + 0.003
        );
    }

    const starGeometry = new THREE.BufferGeometry();

    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.12,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });

    const starField = new THREE.Points(
        starGeometry,
        starMaterial
    );

    scene.add(starField);

    // ------------------------------
    // 11. COSMIC DUST PARTICLES
    // ------------------------------

    const dustCount = 300;

    const dustPositions = new Float32Array(
        dustCount * 3
    );

    for (let i = 0; i < dustCount; i++) {

        dustPositions[i * 3] =
            (Math.random() - 0.5) * 45;

        dustPositions[i * 3 + 1] =
            (Math.random() - 0.5) * 30;

        dustPositions[i * 3 + 2] =
            (Math.random() - 0.5) * 35;
    }

    const dustGeometry = new THREE.BufferGeometry();

    dustGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(dustPositions, 3)
    );

    const dust = new THREE.Points(
        dustGeometry,

        new THREE.PointsMaterial({
            color: 0xa98aff,
            size: 0.07,
            transparent: true,
            opacity: 0.7
        })
    );

    scene.add(dust);

    // ------------------------------
    // 12. SHOOTING STARS
    // ------------------------------

    const shootingStars = [];

    function createShootingStar() {

        const material = new THREE.LineBasicMaterial({
            color: 0xc5b1ff,
            transparent: true,
            opacity: 0.9
        });

        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(-1.2, -0.4, 0)
        ];

        const geometry = new THREE.BufferGeometry()
            .setFromPoints(points);

        const line = new THREE.Line(geometry, material);

        line.position.set(
            (Math.random() - 0.5) * 35,
            Math.random() * 16,
            -5
        );

        line.userData.speed = 0.12 + Math.random() * 0.15;

        scene.add(line);
        shootingStars.push(line);
    }

    // ------------------------------
    // 13. MOUSE MOVEMENT
    // ------------------------------

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (event) => {

        mouseX =
            (event.clientX / window.innerWidth - 0.5) * 2;

        mouseY =
            (event.clientY / window.innerHeight - 0.5) * 2;

    });

    window.addEventListener("touchmove", (event) => {

        if (event.touches.length > 0) {

            mouseX =
                (event.touches[0].clientX /
                window.innerWidth - 0.5) * 2;

            mouseY =
                (event.touches[0].clientY /
                window.innerHeight - 0.5) * 2;
        }

    }, { passive: true });

    // ------------------------------
    // 14. GSAP WEBSITE ANIMATIONS
    // ------------------------------

    if (typeof gsap !== "undefined") {

        gsap.from(".navbar", {
            y: -60,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });

        gsap.from(".eyebrow", {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.3
        });

        gsap.from(".hero h1", {
            y: 60,
            opacity: 0,
            duration: 1.2,
            delay: 0.5,
            ease: "power4.out"
        });

        gsap.from(".hero-description", {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.8
        });

        gsap.from(".hero-buttons", {
            y: 25,
            opacity: 0,
            duration: 1,
            delay: 1
        });

        gsap.from(".hero-stats", {
            y: 25,
            opacity: 0,
            duration: 1,
            delay: 1.2
        });

        gsap.from(".feature-card", {
            scrollTrigger: undefined,
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            delay: 0.2
        });

        // Animate feature cards when they enter the screen
        const observer = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    gsap.fromTo(
                        entry.target,
                        {
                            y: 45,
                            opacity: 0
                        },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: "power3.out"
                        }
                    );

                    observer.unobserve(entry.target);
                }
            });

        }, { threshold: 0.15 });

        document.querySelectorAll(".feature-card").forEach(card => {
            observer.observe(card);
        });
    }

    // ------------------------------
    // 15. MAIN ANIMATION LOOP
    // ------------------------------

    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Planet rotation
        planet.rotation.y += 0.002;
        planet.rotation.x = 0.08;

        // Floating planet movement
        planetGroup.position.y =
            (isMobile ? -2.8 : 0.2) +
            Math.sin(elapsed * 0.5) * 0.12;

        // Orbiting moon
        moon.position.set(
            planetGroup.position.x +
            Math.cos(elapsed * 0.55) * 6.5,

            planetGroup.position.y +
            Math.sin(elapsed * 0.55) * 2,

            Math.sin(elapsed * 0.55) * 3
        );

        moon.rotation.y += 0.004;

        // Galaxy movement
        starField.rotation.y += 0.00012;
        starField.rotation.x += 0.00004;

        dust.rotation.y -= 0.0002;
        dust.rotation.x += 0.0001;

        // Interactive planet tilt
        planetGroup.rotation.y +=
            (mouseX * 0.16 - planetGroup.rotation.y) * 0.015;

        planetGroup.rotation.x +=
            (-mouseY * 0.08 - planetGroup.rotation.x) * 0.015;

        // Camera movement
        camera.position.x +=
            (mouseX * 0.5 - camera.position.x) * 0.015;

        camera.position.y +=
            (-mouseY * 0.3 - camera.position.y) * 0.015;

        camera.lookAt(0, 0, 0);

        // Shooting star movement
        shootingStars.forEach((star, index) => {

            star.position.x -= star.userData.speed;
            star.position.y -= star.userData.speed * 0.35;

            if (star.position.x < -25) {
                scene.remove(star);
                shootingStars.splice(index, 1);
            }

        });

        // Add shooting stars occasionally
        if (Math.random() > 0.994 && shootingStars.length < 5) {
            createShootingStar();
        }

        renderer.render(scene, camera);
    }

    animate();

    // ------------------------------
    // 16. RESPONSIVE RESIZING
    // ------------------------------

    window.addEventListener("resize", () => {

        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 1.5)
        );

        const mobile = width < 700;

        planetGroup.position.x = mobile ? 0 : 3.8;
        planetGroup.scale.setScalar(mobile ? 0.68 : 1);

    });

    console.log("STUDENTVERSE 3D Universe Started Successfully!");

}

// ===================================
// 3D MOUSE INTERACTION FOR CARDS
// ===================================

const featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        if (window.innerWidth <= 600) return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;

        card.style.setProperty("--rotate-x", `${rotateX}deg`);
        card.style.setProperty("--rotate-y", `${rotateY}deg`);

        card.style.setProperty(
            "--mouse-x",
            `${(x / rect.width) * 100}%`
        );

        card.style.setProperty(
            "--mouse-y",
            `${(y / rect.height) * 100}%`
        );

    });

    card.addEventListener("mouseleave", () => {

        card.style.setProperty("--rotate-x", "0deg");
        card.style.setProperty("--rotate-y", "0deg");

        card.style.setProperty("--mouse-x", "50%");
        card.style.setProperty("--mouse-y", "50%");

    });

});

