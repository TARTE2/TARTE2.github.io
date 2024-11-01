document.addEventListener('DOMContentLoaded', function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight);
    camera.position.set(0, 0, 5); // Reculer la caméra pour une meilleure vue

    // Ajouter des lumières
    const ambientLight = new THREE.AmbientLight(0x404040); // Lumière ambiante douce
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0xeeeeee, 1); // Lumière point 1
    light1.position.set(5, 5, 5); // Positionner la première lumière
    scene.add(light1);

    const light2 = new THREE.PointLight(0xeeeeee, 1); // Lumière point 2
    light2.position.set(-5, -5, 5); // Positionner la deuxième lumière
    scene.add(light2);

    const light3 = new THREE.PointLight(0xeeeeee, 1); // Lumière point 3
    light3.position.set(0, 5, 0); // Positionner la troisième lumière
    scene.add(light3);

    const light4 = new THREE.PointLight(0xeeeeee, 1); // Lumière point 4
    light4.position.set(0, -5, 0); // Positionner la quatrième lumière
    scene.add(light4);

    // Initialise le renderer avec fond transparent et antialiasing
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Activer l'anticrénelage
    renderer.setSize(window.innerWidth, window.innerHeight );
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement); // Ajoutez le renderer à la page

    const loader = new THREE.GLTFLoader();
    let model; // Déclarez la variable pour le modèle en dehors de la fonction de chargement

    loader.load(
        'model/camera.glb',
        function (gltf) {
            model = gltf.scene; // Affectez le modèle à la variable
            console.log("Modèle chargé avec succès", model); // Log pour vérifier le chargement
            scene.add(model);
            model.position.set(0, 0, 0);
            model.scale.set(10, 10, 10); // Ajustez la taille si nécessaire

            let totalVertices = 0;
            let totalFaces = 0;
            model.traverse((node) => {
                if (node.isMesh) {
                    totalVertices += node.geometry.attributes.position.count;
                    totalFaces += node.geometry.index ? node.geometry.index.count / 3 : node.geometry.attributes.position.count / 3;
                }
            });
            console.log("Nombre total de sommets (vertices) :", totalVertices);
            console.log("Nombre total de faces :", totalFaces);
        },
        undefined,
        function (error) {
            console.error('Erreur lors du chargement du modèle :', error);
        }
    );

    let rotating = true; // Variable pour contrôler la rotation
    let lastMouseX, lastMouseY; // Pour le suivi de la souris
    let isMouseDown = false; // Pour vérifier si le bouton de la souris est enfoncé

    // Fonction de rendu avec rotation
    function loop() {
        requestAnimationFrame(loop);

        if (model && rotating) { // Vérifiez si le modèle est chargé avant d'appliquer la rotation
            model.rotation.y += 0.01; // Faites tourner le modèle autour de l'axe Y
            model.rotation.x += 0.005; // Faites tourner le modèle autour de l'axe X
        }

        renderer.render(scene, camera);
    }

    // Événement pour le zoom
    window.addEventListener('wheel', (event) => {
        event.preventDefault(); // Empêche le défilement de la page
        camera.position.z += event.deltaY * 0.01; // Zoom avant/arrière

        // Stoppe la rotation pendant 2 secondes
        rotating = false;
        setTimeout(() => {
            rotating = true;
        }, 2000);
    });

    // Événements pour changer l'orientation de l'objet
    window.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;

        // Stoppe la rotation pendant 2 secondes
        rotating = false;
        setTimeout(() => {
            rotating = true;
        }, 2000);
    });

    window.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const deltaX = event.clientX - lastMouseX;
            const deltaY = event.clientY - lastMouseY;

            model.rotation.y += deltaX * 0.01; // Modifier la rotation en fonction du mouvement de la souris
            model.rotation.x += deltaY * 0.01;

            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
        }
    });

    window.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    loop();
});
