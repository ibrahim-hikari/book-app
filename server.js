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
server.post('/find', findBook);




function renderForm(req,res) {
    res.render('pages/index')
}

function findBook(req,res) {
    const url = ''
}
server.listen(PORT, () => { console.log(`Hello form ${PORT}`); })