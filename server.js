`use strict`;

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

const PORT = process.env.PORT || 3000;
const server = express();

server.use(express.static('./public'));
server.use(express.urlencoded({ extended: true }));
server.set('view engine', 'ejs');

// Routs //
server.get('/', getBooks);
server.get('/searches', renderForm);
server.post('/searches', findBook);
server.post('/select', selectedBook);
server.post('/add', savedbook);


function renderForm(req, res) {
    res.render('pages/searches/search')

}


function findBook(req, res) {
    let url = `https://www.googleapis.com/books/v1/volumes?q=in`
    if (req.body.search === 'title') {
        url = `https://www.googleapis.com/books/v1/volumes?q=in${req.body.search}:${req.body.keyword}`
    } else if (req.body.search === 'author') {
        url = `https://www.googleapis.com/books/v1/volumes?q=in${req.body.search}:${req.body.keyword}`
    }
    // console.log('url', url);

    return superagent.get(url)
        .then(data => {
            let books = data.body.items.map((stuff) => {
                return new Book(stuff);
            });
            // console.log('asd', books);

            res.render('pages/searches/show', { books: books })
        });
}

function savedbook(req, res) {

    let { title, author, image_url, isbn, description } = req.body;

    let SQL = 'INSERT INTO books(title, author, image_url, isbn, description) VALUES ($1, $2, $3, $4, $5);'
    let values = [title, author, image_url, isbn, description];
    console.log('new', values);

    client.query(SQL, values)
        .then(results => {
            res.redirect('/');
        })
};

function Book(data) {
    this.authors = (data.volumeInfo.authors && data.volumeInfo.authors[0]) || ' '
    this.title = data.volumeInfo.title
    this.isbn = (data.volumeInfo.industryIdentifiers && data.volumeInfo.industryIdentifiers[0].identifier) || ' '
    this.image = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) || ' '
    this.description = data.volumeInfo.description
}

function selectedBook(req, res) {
    let { title, authors, isbn, image, desc } = req.body
    res.render('pages/searches/select', { book: req.body })
}

function getBooks(req, res) {
    let SQL = 'SELECT * FROM books;';
    client.query(SQL)
        .then(results => {
            res.render('pages/index', { books: results.rows });
        })
}

client.connect()
    .then(() => server.listen(PORT, () => { console.log(`Hello form ${PORT}`); }));