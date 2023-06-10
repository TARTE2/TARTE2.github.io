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


document.addEventListener('DOMContentLoaded', function() {
  const items = document.querySelectorAll('.item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      item.classList.toggle('active');
    });
  });
});


window.addEventListener('scroll', function() {
  var menu = document.querySelector('.sticky-menu');
  var scrollPosition = window.scrollY;

  if (scrollPosition > 0) {
    menu.classList.add('sticky');
  } else {
    menu.classList.remove('sticky');
  }
});




