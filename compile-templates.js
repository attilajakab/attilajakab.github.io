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

const template = fs.readFileSync('templates/template.handlebars', 'utf8');
const productsPartial = fs.readFileSync('templates/partials/products.handlebars','utf8');

const compiled = hb.compile(template);
const html = compiled(data, { 
    helpers,
    partials: { productsPartial }
});

fs.writeFileSync('index.html', html);