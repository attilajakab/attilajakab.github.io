document.addEventListener("DOMContentLoaded", function(event) { 
    const imgs = document.querySelectorAll('.card-img-top');
    const imgPreviewBackdrop = document.getElementById('img-preview-backdrop');
    const imgPreview = document.getElementById('img-preview');

    imgs.forEach(el => el.addEventListener('click', event => {
      imgPreviewBackdrop.style.display = 'flex';
      imgPreview.src = event.target.getAttribute('data-src-large');
    }));

    imgPreviewBackdrop.addEventListener('click', event => {
      if (event.target.id === 'img-preview') {
        return;
      }
      imgPreviewBackdrop.style.display = 'none';
    });

    const hamburgerBtn = document.querySelector('.hamburger-menu');

    hamburgerBtn.addEventListener('click', event => {
        const singleNavLink = document.querySelector('nav a');
        const allNavLinks = document.querySelectorAll('nav a');
        
        if (singleNavLink.classList.contains('d-none')) {
            allNavLinks.forEach(el => el.classList.remove('d-none'));
        } else {
            allNavLinks.forEach(el => el.classList.add('d-none'));
        }
    });
});