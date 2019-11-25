`use strict`;

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');

const PORT = process.env.PORT || 3000;
const server = express();

server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

server.get('/', renderForm);
server.get('/searches', findBook);

server.get('/test', (req, res) => {
    res.render('pages/searches/show')
    // res.redirect('http://www.google.com')
})



function renderForm(req, res) {
    res.render('pages/index')
}


function findBook(req, res) {
    let searchBy = authors;
    let words = peanuts;
    const url = `https://www.googleapis.com/books/v1/volumes?q=in${searchBy}:${words}`
    return superagent.get(url)
        .then(data => {
            let books = data.body;
            return books.items.map((stuff) => {
                return new Book(stuff);
            });
        })
        .then(voala => res.render('pages/searches/show', {asd:voala}));
}


function Book(data) {
    this.authors = data.volumeInfo.authors[0]
    this.title = data.volumeInfo.title
    this.ISBN = data.volumeInfo.industryIdentifiers
    this.description = data.volumeInfo.description
    this.image = data.volumeInfo.imageLinks
}
server.listen(PORT, () => { console.log(`Hello form ${PORT}`); })