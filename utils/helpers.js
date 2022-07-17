module.exports = {
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
    toSlug: function (textToSlug) {
        const diacriticsMap = {
            'á': 'a',
            'é': 'e',
            'í': 'i',
            'ó': 'o',
            'ú': 'u',
            'ý': 'y',
            'ď': 'd',
            'ť': 't',
            'ň': 'n',
            'ľ': 'l',
            'č': 'c',
            'š': 's',
            'ô': 'o',
            'ž': 'z' 
            
        }

        return textToSlug
            .trim()
            .toLowerCase()
            .replace(/\s\s+/g, ' ')
            .replace(' - ', '-')
            .replace('/', '')
            .split('')
            .map(char => {
                if (char === ' ') return '-';
                if (diacriticsMap[char]) return diacriticsMap[char];
                return char;
        }).join('');
    }
};