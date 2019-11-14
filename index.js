const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const BookstoreServices = require('./books-services');

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    console.log("hello")
    res.status(200).send('hello');
})


app.get('/books', (req, res, next) => {
    const knexInstance = req.app.get('db');
    const genre = req.query.genre;
    const genres = ['mystery', 'biography','thriller','history','historical-fiction', 'romance'];

    if(genre) {
        const chosenGenre = genres.find(g => g === genre)
        if(!chosenGenre) {
            res.status(404).send({error: {message:'Genre must be one of mystery, biography, history, romance or historical-fiction only'}})
        }
        BookstoreServices.getBookByGenre(knexInstance, chosenGenre)
            .then(genreBooks => {
                res.status(200).json(genreBooks)
            })
            .catch(next)
    }
    BookstoreServices.getAllBooks(knexInstance)
        .then(books => {
            res.status(200).json(books)
        })
        .catch(next)
})

app.post('/books', (req, res, next) => {
    console.log(Object.keys(req))
    const knexInstance = req.app.get('db');
    const {title, year_published, genre} = req.body;
    const newBook = {title, year_published, genre};
    const genres = ['mystery', 'biography','thriller','history','historical-fiction', 'romance'];
   
    for([key, value] of Object.entries(newBook)) {
        if(value == null) {
            return res.status(400).send({error: {message: `Missing ${key}`}})
        }
    }

    if(!genre.includes(genres)) {
        return res.status(400).send({error: {message: 'Genre must be one of mystery, biography, history, romance or historical-fiction only'}})
    }

    BookstoreServices.postIntoBooks(knexInstance, newBook)
        .then(newBook => {
            res.status(201).json(newBook)
        })
        .catch(next)
})


app.get('/books/:id', (req, res, next) => {
    const knexInstance = req.app.get('db');
    let bookId = Number(req.params.id);
    BookstoreServices.getBookById(knexInstance, bookId)
        .then(book => {
            if(!book) {
                res.status(404).send({error: {message: `there is no book with id ${bookId}`}})
            }
            res.status(200).json(book) })
        .catch(next)   
    
}) 
app.delete('/books/:id', (req, res, next) => {
    const idToRemove = req.params.id;
    const knexInstance = req.app.get('db');
    console.log(idToRemove, '!!!!!!')
    BookstoreServices.deleteBook(knexInstance, idToRemove)
        .then(() => {
            console.log("HERE?", idToRemove)
            res.status(204).end()
        })
        .catch(next)
}) ;
app.patch('/books/:id', (req, res, next) => {
    const knexInstance = req.app.get('db');
    const idToUpdate = req.params.id;
    const {title, year_published, genre} = req.body;
    const fieldsToUpdate = {title, year_published, genre};

    BookstoreServices.updateBook(knexInstance, idToUpdate, fieldsToUpdate)
        .then(() => {
            res.status(204).end()
        })
})  

module.exports = app;