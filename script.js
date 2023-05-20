var darkModeToggle = document.getElementById('darkModeToggle');
var body = document.body;

// Vérifier si le mode sombre est activé par défaut
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  body.classList.add('dark-mode');
}

darkModeToggle.addEventListener('click', function() {
  body.classList.toggle('dark-mode');
  body.style.transition = 'background-color 0.3s ease';
});



