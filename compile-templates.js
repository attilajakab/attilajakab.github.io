const hb = require("handlebars");
const fs = require('fs');
const path = require('path');

const helpers = require('./utils/helpers');

// Prepare data
const data = require('./data.json');
data.products = data.products.map(product => {
    product.slug = `/products/${helpers.toSlug(product.title)}.html`;
    product.priceWithoutSymbol = product.price.replace('€', '');
    return product;
});
data.kolekciaDcera = data.products.filter(product => product.category === 'Dcéra');
data.kolekciaMamaADcera = data.products.filter(product => product.category === 'Mama&Dcéra');
data.kolekciaChlapcek = data.products.filter(product => product.category === 'Chlapček');
data.kolekciaZena = data.products.filter(product => product.category === 'Žena');
data.types = [];
data.products.forEach(product => {
    if (data.types.indexOf(product.type) === -1) {
        data.types.push(product.type);
    }
});

// Pages
const indexPage = fs.readFileSync('templates/template.handlebars', 'utf8');
const productsPage = fs.readFileSync('templates/all-products.handlebars', 'utf8');
const singleProductPage = fs.readFileSync('templates/single-product.handlebars','utf8');

// Partials
const orderForm = fs.readFileSync('templates/partials/order-form.handlebars','utf8');
const productsPartial = fs.readFileSync('templates/partials/products.handlebars','utf8');
const privacyPolicyModalPartial = fs.readFileSync('templates/partials/privacy-policy-modal.handlebars','utf8');
const termsConditionsModalPartial = fs.readFileSync('templates/partials/terms-conditions-modal.handlebars','utf8');
const measurementModalPartial = fs.readFileSync('templates/partials/measurement-modal.handlebars','utf8');
const header = fs.readFileSync('templates/partials/header.handlebars','utf8');
const footer = fs.readFileSync('templates/partials/footer.handlebars','utf8');

const compiledIndexPage = hb.compile(indexPage);
const indexPageHtml = compiledIndexPage(data, { 
    helpers,
    partials: { 
        header,
        orderForm,
        productsPartial, 
        privacyPolicyModalPartial, 
        termsConditionsModalPartial,
        measurementModalPartial,
        footer
    }
});

const compiledProductsPage = hb.compile(productsPage);
const productsPageHtml = compiledProductsPage(data, { 
    helpers,
    partials: { 
        header,
        orderForm,
        privacyPolicyModalPartial, 
        termsConditionsModalPartial,
        measurementModalPartial,
        footer
    }
});

fs.writeFileSync('index.html', indexPageHtml);
fs.writeFileSync('products.html', productsPageHtml);

const compiledSingleProductPage = hb.compile(singleProductPage);
data.products.map(product => {
    const singleProductPage = compiledSingleProductPage(product, { 
        helpers,
        partials: { 
            header,
            privacyPolicyModalPartial, 
            termsConditionsModalPartial,
            measurementModalPartial,
            footer
        }
    });
    fs.writeFileSync(`products/${path.basename(product.slug)}`, singleProductPage);
});