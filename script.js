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

    gsap.registerPlugin(ScrollTrigger)

    gsap.to('.boxtest', {
        opacity: 1,
        x: 50,

        scrollTrigger: {
            trigger: '.boxtest',
            start: '0% 70%',
            end: '30% 80%',
            scrub: true,
            markers: true, // Voir les marqueurs pour débogage
        }
    });

    // gsap.to('.boxtest', {
    //     opacity: 1, // L'opacité augmente jusqu'à 1 avant de redescendre
    //     scrollTrigger: {
    //         trigger: '.boxtest',
    //         start: '0% 80%',  // Commence l'augmentation à ce point
    //         end: '100% 85%',  // Commence à diminuer après ce point
    //         scrub: true,      // Synchronisation avec le défilement
    //         markers: true,    // Marqueurs visibles pour débogage
    //         onUpdate: function(self) {
    //             const progress = self.progress; // Progrès de l'animation entre 0 et 1
    //             const newOpacity = progress <= 0.5 ? progress * 2 : 2 - (progress * 2); // Augmentation puis réduction
    //             gsap.set('.boxtest', { opacity: newOpacity });
    //         }
    //     }
    // });
});

function  createSectionOneHtml(){
    const birthDate = new Date('2004-01-07');
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    return `<h1>À propos de moi</h1>
        <div class="box1">
            <img class="pp" src="images/Ewen2-min.jpg" alt="photo Ewen FILY">
            <div class="box2">
                <h2>Ewen FILY </h2>
                <p>${age} ans <br> Actuellement en 3<sup>ème</sup> année à l'IUT de Lannion en BUT informatique.</br></p>
                <p class="cv-bt"><a href="/documents/FILY_Ewen_CV_links.pdf" target="_blank">Mon CV</a></p>
            </div>
        </div>`;

}





