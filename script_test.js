document.addEventListener('DOMContentLoaded', function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight);
    camera.position.set(0, 0, 5); // Reculer la caméra pour une meilleure vue

    // Initialise le renderer avec fond transparent et antialiasing
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Activer l'anticrénelage
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);// Ajoutez le renderer à la page

    // Sélectionnez l'élément du slider pour la taille
    const $scaleSlider = $('#scaleSlider');
    const $rotateSlider = $('#rotateSlider');

    // Sélectionnez les éléments de la checkbox
    const $rotationCheckbox = $('#rotationCheckbox');

    const loader = new THREE.GLTFLoader();
    let model; // Déclarez la variable pour le modèle en dehors de la fonction de chargement

    loadModel('model/halo_reach_emile-a239.glb',scene);

    let rotating = true; // Variable pour contrôler la rotation
    let lastMouseX, lastMouseY; // Pour le suivi de la souris
    let isMouseDown = false; // Pour vérifier si le bouton de la souris est enfoncé
    let isMovingCamera = false; // Indicateur pour savoir si on déplace la caméra
    let previousMousePosition = { x: 0, y: 0 }; // Position précédente de la souris

    // Événement pour le zoom
    $('canvas').on('wheel', (event) => {
        event.preventDefault(); // Empêche le défilement de la page
        camera.position.z += event.deltaY * 0.003; // Zoom avant/arrière

        // Stoppe la rotation pendant 2 secondes
        rotating = false;
        setTimeout(() => {
            rotating = true;
        }, 2000);
    });

    // Événements pour changer l'orientation de l'objet
    $('canvas').on('mousedown', function(event) {
        if (event.button === 0) { // Clic gauche
            isMouseDown = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;

            // Si la touche Maj est enfoncée, commencer à déplacer la caméra
            if (event.shiftKey) {
                isMovingCamera = true;
                previousMousePosition.x = event.clientX;
                previousMousePosition.y = event.clientY;
            } else {
                // Stoppe la rotation pendant 2 secondes si ce n'est pas un mouvement de caméra
                rotating = false;
                setTimeout(() => {
                    rotating = true;
                }, 2000);
            }
        }
    });

    $('canvas').on('mousemove', (event) => {
        if (isMouseDown) {
            if (isMovingCamera) {
                const deltaX = event.clientX - previousMousePosition.x;
                const deltaY = event.clientY - previousMousePosition.y;

                // Ajuster la position de la caméra en fonction du mouvement de la souris
                camera.position.x -= deltaX * 0.01; // Ajuster la vitesse de mouvement selon vos besoins
                camera.position.y += deltaY * 0.01;

                // Mettre à jour la position précédente de la souris
                previousMousePosition.x = event.clientX;
                previousMousePosition.y = event.clientY;
            } else {
                const deltaX = event.clientX - lastMouseX;
                const deltaY = event.clientY - lastMouseY;

                model.rotation.y += deltaX * 0.01; // Modifier la rotation en fonction du mouvement de la souris
                model.rotation.x += deltaY * 0.01;

                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }
        }
    });

    $(window).on('mouseup', () => {
        isMouseDown = false;
        isMovingCamera = false; // Réinitialiser le déplacement de la caméra
    });

    function handleFile(event) {
        const file = event.target.files[0];
        if (!file) return;



        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;

            // Convert ArrayBuffer to Blob
            const blob = new Blob([content], { type: 'model/gltf-binary' });
            // Create a temporary URL for the blob
            const url = URL.createObjectURL(blob);

            loadModel(url, scene);
        };
        reader.readAsArrayBuffer(file);
    }

    let currentGroup = null; // Conserver une référence au groupe actuel

    function loadModel(content, scene) {
        console.log(content)
        loader.load(
            content,
            function (gltf) {
                model = gltf.scene; // Affectez le modèle à la variable
                console.log("Modèle chargé avec succès", model);

                // Supprimer l'ancien groupe s'il existe
                if (currentGroup) {
                    scene.remove(currentGroup);
                    currentGroup.traverse((node) => {
                        if (node.isMesh) {
                            node.geometry.dispose(); // Libérer la géométrie
                            if (node.material) {
                                if (Array.isArray(node.material)) {
                                    node.material.forEach((material) => material.dispose());
                                } else {
                                    node.material.dispose(); // Libérer le matériel
                                }
                            }
                        }
                    });
                    currentGroup = null; // Réinitialiser la référence
                }

                // Créer un nouveau groupe pour le modèle
                let group = new THREE.Group();
                scene.add(group);
                currentGroup = group; // Mettre à jour la référence

                // Positionner le modèle dans le groupe
                group.add(model);
                model.position.set(0, -1, 0); // Position par rapport au groupe
                model.scale.set(4, 4, 4); // Ajustez la taille si nécessaire

                // Ajouter les lumières (si nécessaire, vous pourriez déplacer ces lumières hors de cette fonction si elles sont constantes)
                let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);

                let directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
                directionalLight1.position.set(0, 5, 5).normalize();
                scene.add(directionalLight1);

                // Compte des sommets et des faces
                let totalVertices = 0;
                let totalFaces = 0;
                model.traverse((node) => {
                    if (node.isMesh) {
                        totalVertices += node.geometry.attributes.position.count;
                        totalFaces += node.geometry.index
                            ? node.geometry.index.count / 3
                            : node.geometry.attributes.position.count / 3;
                    }
                });
                console.log("Nombre total de sommets (vertices) :", totalVertices);
                console.log("Nombre total de faces :", totalFaces);

                // Mise à jour de la fonction de rendu pour faire tourner le groupe
                function loop() {
                    requestAnimationFrame(loop);
                    rotating = !$rotationCheckbox.prop('checked');

                    model.scale.set(
                        4 * $scaleSlider.val(),
                        4 * $scaleSlider.val(),
                        4 * $scaleSlider.val()
                    );

                    // Effectuer la rotation du groupe uniquement si en rotation
                    if (group && rotating) {
                        group.rotation.y += 0.01 * $rotateSlider.val(); // Faites tourner le groupe autour de l'axe Y
                    }

                    renderer.render(scene, camera);
                }

                loop(); // Lancer la boucle de rendu
            },
            undefined,
            function (error) {
                console.error('Erreur lors du chargement du modèle :', error);
            }
        );
    }


    $('#fileInput').on('change', handleFile);

});




