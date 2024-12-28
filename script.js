$(document).ready(function () {
    // Check for user preference and apply dark mode if enabled
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        $('body').addClass('dark-mode');
        $('#img_threeJS').addClass('svg-dark-mode');
    }

    // Toggle dark mode on button click
    $('#darkModeToggle').click(function () {
        $('body').toggleClass('dark-mode');
        $('#img_threeJS').toggleClass('svg-dark-mode');
        // Smooth transition for better user experience
        $('body').css('transition', 'background-color 0.3s ease');
        $('#img_threeJS').css('transition', 'background-color 0.3s ease');

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
<!--                <p class="cv-bt"><a href="/documents/FILY_Ewen_CV_links.pdf" target="_blank">Mon CV</a></p>-->
            </div>
        </div>`;

}





