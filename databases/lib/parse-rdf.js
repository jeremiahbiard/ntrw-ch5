'use strict';

const cheerio = require('cheerio');

module.exports = rdf => {
    const $ = cheerio.load(rdf);

    const book = {};

    book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');

    book.title = $('dcterms\\:title').text();

    book.authors = $('pgterms\\:agent pgterms\\:name').toArray().map(elem => $(elem).text());

    book.subjects = $('[rdf\\:resource$="/LCSH"]')
        .parent().find('rdf\\:value')
        .toArray().map(elem => $(elem).text());

    // Find the rdf:resource tag that ends in /LCC
    // traverse up to the parent rdf:description, then read
    // the text of the first descendant rdf:value tag
    book.lcc = $('[rdf\\:resource$="/LCC"]')
        .parent().find('rdf\\:value')
        .toArray().map(elem => $(elem).text())[0];
    return book;
};