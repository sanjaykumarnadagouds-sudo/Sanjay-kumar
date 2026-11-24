
/* =========================================
   STUDENTVERSE - 3D DASHBOARD UNIVERSE
========================================= */

const canvas = document.getElementById("dashboard-universe");

if (canvas && typeof THREE !== "undefined") {

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
        65,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = 12;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0x895cff, 3, 40);
    purpleLight.position.set(5, 5, 5);
    scene.add(purpleLight);

    const blueLight = new THREE.PointLight(0x22bbff, 2, 40);
    blueLight.position.set(-5, -3, 5);
    scene.add(blueLight);

    // STAR FIELD
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2500;
    const starPositions = [];

    for (let i = 0; i < starCount; i++) {
        starPositions.push(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 80
        );
    }

    starGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starPositions, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.12,
        transparent: true,
        opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // MAIN 3D PLANET
    const planetGeometry = new THREE.SphereGeometry(2.2, 64, 64);

    const planetMaterial = new THREE.MeshStandardMaterial({
        color: 0x6240c9,
        roughness: 0.7,
        metalness: 0.15,
        emissive: 0x160044,
        emissiveIntensity: 0.25
    });

    const planet = new THREE.Mesh(
        planetGeometry,
        planetMaterial
    );

    planet.position.set(4.5, 0, -2);
    scene.add(planet);

    // PLANET ATMOSPHERE
    const atmosphereGeometry = new THREE.SphereGeometry(2.35, 64, 64);

    const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7955ff,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide
    });

    const atmosphere = new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
    );

    atmosphere.position.copy(planet.position);
    scene.add(atmosphere);

    // ORBIT RING
    const ringGeometry = new THREE.TorusGeometry(3, 0.025, 16, 150);

    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x8d70ff,
        transparent: true,
        opacity: 0.8
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);

    ring.position.copy(planet.position);
    ring.rotation.x = 1.15;
    ring.rotation.y = 0.25;
    scene.add(ring);

    // SMALL MOON
    const moonGeometry = new THREE.SphereGeometry(0.35, 32, 32);

    const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0x48caff,
        roughness: 0.5,
        emissive: 0x123c77,
        emissiveIntensity: 0.5
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // MOUSE MOVEMENT
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    });

    // ANIMATION
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        planet.rotation.y += 0.002;
        planet.rotation.x = Math.sin(time * 0.2) * 0.05;

        ring.rotation.z += 0.0015;

        stars.rotation.y += 0.00015;
        stars.rotation.x += 0.00005;

        moon.position.x =
            planet.position.x + Math.cos(time * 0.7) * 3.2;

        moon.position.z =
            planet.position.z + Math.sin(time * 0.7) * 3.2;

        moon.position.y =
            planet.position.y + Math.sin(time * 0.4) * 0.5;

        camera.position.x +=
            (mouseX * 0.35 - camera.position.x) * 0.02;

        camera.position.y +=
            (-mouseY * 0.25 - camera.position.y) * 0.02;

        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    // RESIZE
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

} else {
    console.error("Three.js or dashboard canvas is missing.");
}


/* =====================================
   STUDENTVERSE STUDY PROGRESS
===================================== */

// Load saved study minutes
let studyMinutes =
    Number(localStorage.getItem("studyMinutes")) || 0;

// Dashboard elements
const studyButton = document.getElementById("study-btn");
const goalText = document.getElementById("goal-text");
const goalFill = document.getElementById("goal-fill");
const progressValue = document.getElementById("progress-value");
const progressRing = document.getElementById("progress-ring");
const resetButton = document.getElementById("reset-btn");


/* =====================================
   DAILY STUDY GOAL
===================================== */

function updateStudyProgress() {

    const percentage = Math.min(
        (studyMinutes / 180) * 100,
        100
    );

    const studiedHours = (studyMinutes / 60).toFixed(1);

    // Update daily goal text
    if (goalText) {
        goalText.textContent =
            `${studiedHours} of 3 hours completed`;
    }

    // Update daily goal progress bar
    if (goalFill) {
        goalFill.style.width = percentage + "%";
    }

    // Update button when daily goal is completed
    if (studyButton) {
        if (studyMinutes >= 180) {
            studyButton.textContent = "Daily Goal Completed ✓";
            studyButton.disabled = true;
        } else {
            studyButton.textContent = "+ Add 30 Minutes";
            studyButton.disabled = false;
        }
    }
}


/* =====================================
   ADD STUDY TIME BUTTON
===================================== */

if (studyButton) {

    studyButton.addEventListener("click", () => {

        studyMinutes = Math.min(studyMinutes + 30, 180);

        localStorage.setItem("studyMinutes", studyMinutes);

        updateStudyProgress();
        updateDashboardProgress();

        // Button animation
        studyButton.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(1.15)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 400,
                easing: "ease-out"
            }
        );
    });
}


/* =====================================
   RESET DAILY STUDY GOAL
===================================== */

if (resetButton) {

    resetButton.addEventListener("click", () => {

        studyMinutes = 0;

        localStorage.setItem("studyMinutes", 0);

        updateStudyProgress();
        updateDashboardProgress();
    });
}


/* =====================================
   CONNECT DASHBOARD WITH PROGRESS TRACK
===================================== */

function updateDashboardProgress() {

    // Get saved subject progress
    const savedProgress = JSON.parse(
        localStorage.getItem("studentverse_progress_v1") || "{}"
    );

    // Total subjects in four semesters
    const totalSubjects = 20;

    // Count completed subjects
    const completedSubjects = Object.values(savedProgress)
        .filter(value => value === true).length;

    // Calculate overall percentage
    const overallPercentage = Math.min(
        Math.round((completedSubjects / totalSubjects) * 100),
        100
    );

    // Calculate learning hours
    const minutes =
        Number(localStorage.getItem("studyMinutes")) || 0;

    const learningHours = (minutes / 60).toFixed(1);

    // Achievement milestones: 25%, 50%, 75%, 100%
    const achievements = Math.floor(overallPercentage / 25);

    // Get dashboard statistic cards
    const cards = document.querySelectorAll(".stats .stat-card");

    // Update statistics
    if (cards.length >= 4) {

        // Learning Modules
        const moduleCounter = cards[0].querySelector(".counter");

        if (moduleCounter) {
            moduleCounter.textContent = "4";
        }

        // Overall Progress
        const progressCounter = cards[1].querySelector(".counter");

        if (progressCounter) {
            progressCounter.textContent = overallPercentage;
        }

        // Learning Hours
        const hoursCounter = cards[2].querySelector(".counter");

        if (hoursCounter) {
            hoursCounter.textContent = learningHours;
        }

        // Achievements
        const achievementCounter = cards[3].querySelector(".counter");

        if (achievementCounter) {
            achievementCounter.textContent = achievements;
        }
    }

    // Update circular progress percentage
    if (progressValue) {
        progressValue.textContent = overallPercentage + "%";
    }

    // Update circular progress ring
    if (progressRing) {

        const degrees = overallPercentage * 3.6;

        progressRing.style.background =
            `conic-gradient(
                #a080ff 0deg,
                #35d4ff ${degrees}deg,
                rgba(255,255,255,0.1) ${degrees}deg 360deg
            )`;
    }
}


/* =====================================
   LOAD DASHBOARD DATA
===================================== */

// Load daily study goal
updateStudyProgress();

// Load overall progress from Progress Track
updateDashboardProgress();


/* =====================================
   REFRESH PROGRESS WHEN RETURNING
===================================== */

// Refresh when returning to dashboard tab
window.addEventListener("focus", () => {
    updateStudyProgress();
    updateDashboardProgress();
});

// Refresh when localStorage changes in another tab
window.addEventListener("storage", () => {
    studyMinutes =
        Number(localStorage.getItem("studyMinutes")) || 0;

    updateStudyProgress();
    updateDashboardProgress();
});

// Refresh when page is restored
window.addEventListener("pageshow", () => {
    studyMinutes =
        Number(localStorage.getItem("studyMinutes")) || 0;

    updateStudyProgress();
    updateDashboardProgress();
});
