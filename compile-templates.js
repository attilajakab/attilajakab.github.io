const hb = require("handlebars");
const fs = require('fs');

const data = require('./data.json');
data.kolekciaDcera = data.products.filter(product => product.category === 'Dcéra');
data.kolekciaMamaADcera = data.products.filter(product => product.category === 'Mama&Dcéra');

const helpers = {
    ifEq: function (a, b, options) {
        if (a == b) { return options.fn(this); }
        return options.inverse(this);
    },
    ifGt: function (a, b, options) {
        if (a > b) { return options.fn(this); }
        return options.inverse(this);
    },
    ifLt: function (a, b, options) {
        if (a < b) { return options.fn(this); }
        return options.inverse(this);
    },
};

const indexPage = fs.readFileSync('templates/template.handlebars', 'utf8');
const productsPage = fs.readFileSync('templates/all-products.handlebars', 'utf8');
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
        privacyPolicyModalPartial, 
        termsConditionsModalPartial,
        measurementModalPartial,
        footer
    }
});

fs.writeFileSync('index.html', indexPageHtml);
fs.writeFileSync('products.html', productsPageHtml);