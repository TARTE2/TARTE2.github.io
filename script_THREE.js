document.addEventListener('DOMContentLoaded', function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight);
    camera.position.set(0, 0, 5); // Reculer la caméra pour une meilleure vue

    // Initialise le renderer avec fond transparent et antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true }); // Activer l'anticrénelage
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);// Ajoutez le renderer à la page

    // Création de l'environnement "Pièce blanche pro"
    scene.background = new THREE.Color(0xf5f6f8); // Blanc/Gris très clair
    scene.fog = new THREE.Fog(0xf5f6f8, 3, 15); // Effet de profondeur

    // Ajout d'une grille au sol (effet plan de travail pro)
    const floorGrid = new THREE.GridHelper(50, 100, 0xa0a0a0, 0xe0e0e0);
    scene.add(floorGrid);
    scene.userData.floorGrid = floorGrid;

    // Ajout d'une grille au fond (mur vertical)
    const backGrid = new THREE.GridHelper(50, 100, 0xa0a0a0, 0xe0e0e0);
    backGrid.rotation.x = Math.PI / 2; // Rotation à 90 degrés pour la rendre verticale
    backGrid.position.z = -5; // La placer en arrière-plan
    scene.add(backGrid);
    scene.userData.backGrid = backGrid;

    // Sélectionnez l'élément du slider pour la taille
    const $scaleSlider = $('#scaleSlider');
    const $rotateSlider = $('#rotateSlider');

    // Sélectionnez les éléments de la checkbox
    const $rotationCheckbox = $('#rotationCheckbox');

    const loader = new THREE.GLTFLoader();
    let model; // Déclarez la variable pour le modèle en dehors de la fonction de chargement

    const $modelSelect = $('#modelSelect');
    
    // Load the default selected model
    loadModel($modelSelect.val(), scene);

    // Event listener for model change
    $modelSelect.on('change', function() {
        const selectedModelUrl = $(this).val();
        if (selectedModelUrl) {
            loadModel(selectedModelUrl, scene);
        }
    });

    // Ajout des contrôles orbitaux (Déplacement de la caméra)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Mouvement fluide
    controls.dampingFactor = 0.05;
    controls.minDistance = 2; // Zoom avant maximum
    controls.maxDistance = 20; // Zoom arrière maximum
    controls.target.set(0, 0, 0); // La caméra fixe le centre

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

                // Centrage automatique et mise à l'échelle du modèle
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3()).length();
                const center = box.getCenter(new THREE.Vector3());

                // Calculer une échelle de base pour que le modèle rentre bien dans l'écran (taille cible ~ 4)
                model.userData.baseScale = 4 / size;
                
                // Centrer le modèle
                model.position.x = -center.x * model.userData.baseScale;
                model.position.y = -center.y * model.userData.baseScale;
                model.position.z = -center.z * model.userData.baseScale;

                // Positionner le modèle dans le groupe
                group.add(model);

                // Placer la grille au sol exactement sous le modèle
                const finalBox = new THREE.Box3().setFromObject(model);
                if (scene.userData.floorGrid) {
                    scene.userData.floorGrid.position.y = finalBox.min.y;
                }
                
                // Ajuster la hauteur de la grille arrière pour qu'elle corresponde au sol
                if (scene.userData.backGrid) {
                    scene.userData.backGrid.position.y = finalBox.min.y;
                }

                // Ajouter les lumières seulement si elles n'existent pas déjà
                if (!scene.userData.lightsAdded) {
                    let ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
                    scene.add(ambientLight);

                    let directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
                    directionalLight1.position.set(0, 5, 5).normalize();
                    scene.add(directionalLight1);

                    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
                    directionalLight2.position.set(-5, -5, -5).normalize();
                    scene.add(directionalLight2);
                    
                    scene.userData.lightsAdded = true;
                }

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

                // Mise à jour de la fonction de rendu pour faire tourner la caméra
                function loop() {
                    requestAnimationFrame(loop);
                    
                    let rotating = !$rotationCheckbox.prop('checked');
                    
                    // L'auto-rotation fait désormais tourner la caméra autour de la scène
                    controls.autoRotate = rotating;
                    controls.autoRotateSpeed = $rotateSlider.val() * 2; // Ajustement de la vitesse de rotation
                    
                    controls.update(); // Nécessaire pour la fluidité (damping) et l'auto-rotation

                    if (model && model.userData.baseScale) {
                        const currentScale = model.userData.baseScale * $scaleSlider.val();
                        model.scale.set(currentScale, currentScale, currentScale);
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




