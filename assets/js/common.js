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

    function getPlainObjectFromFormElement(form) {
        const elements = form.elements;
        return Object.keys(elements)
            .reduce((obj, field) => {
                if (isNaN(field)) {
                    obj[field] = elements[field].value;
                }
                return obj;
            }, {});
    }
    
    function recaptchaCallback() {
        document.querySelector('form').classList.remove('captcha-disabled');
    }

    function recaptchaExpiredCallback() {
        document.querySelector('form').classList.add('captcha-disabled');
    }
    
    document.querySelector('form').onsubmit = function (e) {
        e.preventDefault();

        if (document.querySelector('form').classList.contains('captcha-disabled')) {
            return false;
        }

        const formData = getPlainObjectFromFormElement(e.target);

        fetch('https://y04eh5uok0.execute-api.eu-central-1.amazonaws.com/production/order', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(response => {
            if (response.status === 200) {
                alert('Objednávka úspešne odoslaná!')
            } else {
                alert('Niečo sa pokazilo, kontaktuje nás prosím na celenka.moda@gmail.com.');
            }
        }).catch(() => {
            alert('Niečo sa pokazilo, kontaktuje nás prosím na celenka.moda@gmail.com.');
        }).finally(() => {
            document.querySelector('form').reset();
        });
    }
});