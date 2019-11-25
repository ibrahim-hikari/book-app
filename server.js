`use strict`;

require('dotenv').config();
const express = require('express');
const superagent = require('superagent')

const PORT = process.env.PORT || 3000;
const server = express();

server.use(express.static('./public'));
server.use(express.urlencoded({extended:true}));
server.set('view engine', 'ejs');

server.get('/', renderForm);
server.post('/searches', bookHandler);




function renderForm(req,res) {
    res.render('pages/index')
}

function bookHandler(req, res) {
    // Query String = ?a=b&c=d
    findBook(req.query.data)
        .then(bookData => res.status(200).json(bookData));

}

function findBook(req,res) {
    const url = 'https://www.googleapis.com/books/v1/volumes?q=search+terms'
    return superagent.get(url)
        .then(data =>{
            let books = data.body;
            return books.items.map((stuff)=>{
                return new Book(stuff);
            });
        });
}


function Book(data) {
    this.authors = data.volumeInfo.authors[0]
    this.title = data.volumeInfo.title
    this.id = data.id
    this.description = data.volumeInfo.description
    this.image = data.volumeInfo.imageLinks
}
server.listen(PORT, () => { console.log(`Hello form ${PORT}`); })