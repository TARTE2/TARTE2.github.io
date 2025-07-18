$(document).ready(function () {
    // Check for user preference and apply dark mode if enabled
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        $('body').addClass('dark-mode');

    }

    // Toggle dark mode on button click
    $('#darkModeToggle').click(function () {
        $('body').toggleClass('dark-mode');

        // Smooth transition for better user experience
        $('body').css('transition', 'background-color 0.3s ease');


    });

    $('#aboutMe').append(createSectionOneHtml())

    gsap.registerPlugin(ScrollTrigger);

    // Animation pour chaque projet
    gsap.utils.toArray('.container_project').forEach((project) => {
        gsap.to(project, {
            opacity: 1,
            x: 0, // Revenir à la position initiale
            duration: { min: 0.4, max: 3 }, // Durée de l'animation
            ease: "power2.out", // Douceur de l'animation
            scrollTrigger: {
                trigger: project,
                start: 'top 60%', // L'élément commence à s'animer
                end: 'bottom 80%', // L'élément termine son animation
                toggleActions: "play none none reverse", // Animation au scroll

            }
        });
    });

    // Animation pour .diagonal-cut
    gsap.from(".diagonal-cut", {
        x: "-100%",  // Départ hors de l'écran à gauche
        duration: 0.9,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".box2",  // Élément déclencheur
            start: "top 35%",
            end: "top 10%",
            toggleActions: "play none none reverse", // Animation au scroll

        }
    });

    // Animation pour #text-overlay
    gsap.from("#text-overlay", {
        x: "-100%",  // Départ hors de l'écran à gauche
        duration: 1.2,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".box2", // Même déclencheur que pour .diagonal-cut
            start: "top 35%",
            end: "top 10%",
            // markers: true, // Pour déboguer
            toggleActions: "play none none reverse", // Animation au scroll
        }
    });

    // Sélectionne toutes les balises <a> sauf celles dans <header>
    const $links = $('a:not(header a)');


    // Fonction pour vérifier si l'élément est visible dans la fenêtre de visualisation
    function isInViewport(element) {

        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Fonction pour ajouter l'effet de secousse
    function addShakeEffect() {
        $links.each(function() {
            const $link = $(this);
            if (isInViewport($link[0])) {

                $link.addClass('shake');
                // Supprime la classe après l'animation pour permettre de répéter l'effet
                setTimeout(function() {
                    $link.removeClass('shake');
                }, 1000); // Durée de l'animation
            }
        });
    }

    // Ajoute l'effet de secousse lorsque l'utilisateur fait défiler la page
    $(window).on('scroll', addShakeEffect);
    $(window).on('resize', addShakeEffect);

    // Ajoute l'effet de secousse au chargement de la page
    $(window).on('load', addShakeEffect);

    // Appelle la fonction une fois au chargement initial de la page
    addShakeEffect();




});

function  createSectionOneHtml(){
    const birthDate = new Date('2004-01-07');
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    return `<h1>À propos de moi</h1>
        <div class="box1">
            <img class="pp" src="images/Ewen2-min.jpg" alt="photo Ewen FILY">
            <div class="description_me">
                <h2>Ewen FILY </h2>
                <p>
                    ${age} ans <br> Actuellement en 3<sup>ème</sup> année à l'IUT de Lannion en BUT informatique.<br><br>
                    
                    Je suis à la recherche d'un poste de Développeur pour Septembre 2025<br> 
                    
                    à la suite de l'obtention de mon diplôme pour août 2025.
                
                
                </p>
                <p class="cv-bt"><a href="documents/Ewen Fily - Développeur Full Stack - CV L.pdf" target="_blank">Mon CV</a></p>
            </div>
        </div>
        <h1>Alternance</h1>
        <div class="box2">
            <div style="position: relative">
                <img id="background_mobil-inn" src="images/background_mobil-inn.jpg">
                <a id="logo_mobil-inn" href="https://mobil-inn.com/" target="_blank">
                        <img src="images/mobil-inn_logo.png">
                </a>
                <div class="diagonal-cut"></div>
                <div id="text-overlay">
                    <div>
                        <h2 style="font-size: xx-large">Mobil-inn</h2>
                        <h2>iSmartcollect</h2>
                        <p><i>Au quotidien avec les acteurs de la collecte.</i></p>
                    </div>
                    
                    <div>
                        <h3>Développeur full-stack</h3>
                        
                        <p>Mes missions sont diverses telles que la correction de bugs, 
                        la création de nouveaux outils from scratch ainsi que du développement spécifique pour des clients </p>
                    
                    </div>
                    
                </div>
            </div>
        </div>`;
}

