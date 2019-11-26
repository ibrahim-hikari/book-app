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

server.get('/');
server.get('/searches', renderForm);
server.post('/searches', findBook);
server.post('/select', selectedBook);





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
    console.log('url', url);

    return superagent.get(url)
        .then(data => {
            let books = data.body.items.map((stuff) => {
                return new Book(stuff);
            });
            console.log('asd', books);

            res.render('pages/searches/show', { books: books })
        });
}

// function savedbook(req , res) {



// };

function Book(data) {
    this.authors = (data.volumeInfo.authors && data.volumeInfo.authors[0]) || ' '
    this.title = data.volumeInfo.title
    this.ISBN = (data.volumeInfo.industryIdentifiers && data.volumeInfo.industryIdentifiers[0].identifier) || ' '
    this.description = data.volumeInfo.description
    this.image = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) || ' '
}

function selectedBook(req, res) {
    res.render('pages/searches/select')



}

// function getBooks(req, res) {
//     let SQL = 'SELECT * FROM books;';

//     return client.query(SQL)
//         .then(results => {
//             if (results.rowCount === 0) {
//                 res.render('pages/searches/show');
//             } else {
//                 res.render('pages/index', { books: results.rows });
//             }
//         })
//         .catch(err => handleError(err, res));
// }


server.listen(PORT, () => { console.log(`Hello form ${PORT}`); })