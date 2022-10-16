function recaptchaCallback() {
    document.querySelector('form').classList.remove('captcha-disabled');
}

function recaptchaExpiredCallback() {
    document.querySelector('form').classList.add('captcha-disabled');
}

function initPacketa() {
    const callback = (point) => {
        const chosenPointParagraph = document.getElementById('chosen-point-paragraph');
        const chosenPoint = document.getElementById('chosen-point');
        chosenPoint.textContent = point.name;
        chosenPointParagraph.classList.remove('d-none');
    }

    const options = {
        language: 'sk'
    };

    Packeta.Widget.pick('0f142d20939829b0', callback, options)
}

document.addEventListener("DOMContentLoaded", function(event) { 
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
    
    const orderForm = document.querySelector('form');
    if (orderForm) {
        orderForm.onsubmit = function (e) {
            e.preventDefault();

            if (orderForm.classList.contains('captcha-disabled')) {
                return false;
            }

            if (document.getElementById('chosen-point').textContent.length === 0) {
                return false;
            }

            const formData = getPlainObjectFromFormElement(e.target);
            formData['pickup-point'] = document.getElementById('chosen-point').textContent;

            fetch('https://y04eh5uok0.execute-api.eu-central-1.amazonaws.com/production/order', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }).then(response => {
                if (response.status === 200) {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({'event': 'form_submit'});
                    alert('Objednávka úspešne odoslaná!')
                } else {
                    alert('Niečo sa pokazilo, kontaktuje nás prosím na celenka.moda@gmail.com.');
                }
            }).catch(() => {
                alert('Niečo sa pokazilo, kontaktuje nás prosím na celenka.moda@gmail.com.');
            }).finally(() => {
                document.querySelector('form').reset();
                document.getElementById('chosen-point-paragraph').classList.add('d-none');
            });
        }
    }

    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
        typeFilter.addEventListener('change', function (event) {
            const selectedType = this.value;
            

            const products = document.querySelectorAll('article');

            for (let i = 0; i < products.length; i++) {
                products[i].style.display = 'block';

                if (products[i].getAttribute('data-type') !== selectedType && selectedType !== 'Všetky') {
                    products[i].style.display = 'none';
                }
            }
        });
    }
});