`use strict`;

require('dotenv').config();
const express = require('express');

const PORT = process.env.PORT || 3000;
const server = express();

server.use(express.static('./public'));
server.use(express.urlencoded({extended:true}));
server.set('view engine', 'ejs');





server.get('/', (req, res) => {
    res.render('pages/index')
})

server.listen(PORT, () => { console.log(`Hello form ${PORT}`); })