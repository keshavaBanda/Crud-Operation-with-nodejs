const { ObjectID } = require('bson');
const express = require('express');
const { connectToDb, getFromDb } = require('./db');

//Intilize app
const app = express();
app.use(express.json()) // This line is very important don't forgot this

//dbconnection
let db;
connectToDb((err) => {
    if (!err) {
        console.log("Mongo DB connected")
        app.listen(3000, () => {
            console.log("server listing...");
        })
        db = getFromDb();
    } else {
        console.log("APP Error", err)
    }
})

//routes

// Get Call
app.get('/books', (req, res) => {
    const page = req.query.pageNo;
    const booksPerPage = 5;

    let books = [];
    db.collection('books')
        .find()
        .sort({ author: 1 })
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books)
        })
        .catch((err) => {
            res.status(500).json({ error: "No Data Found" })
        })
})

//Get By Id call
app.get('/books/:id', (req, res) => {
    if (ObjectID.isValid(req.params.id)) {
        db.collection('books')
            .findOne({ _id: ObjectID(req.params.id) })
            .then((doc) => {
                res.status(200).json(doc)
            })
            .catch((err) => {
                res.status(500).json({ error: "No Data Found" })
            })
    } else {
        res.status(500).json({ error: "ID Miss Match" })
    }
})

//POST call
app.post('/books', (req, res) => {
    const book = req.body;
    db.collection('books').insertOne(book).then(result => {
        res.status(201).json(result);
    }).catch((err) => {
        res.status(500).json({ error: "couldn't Save the Document" })
    })
})

//DELETE call 
app.delete('/books/:id', (req, res) => {
    if (ObjectID.isValid(req.params.id)) {
        db.collection('books')
            .deleteOne({ _id: ObjectID(req.params.id) })
            .then((result) => {
                res.status(200).json(result)
            })
            .catch(err => {
                res.status(500).json({ error: "Internal Server Error" })
            })
    } else {
        res.status(500).json({ error: "Id Mismatched" })
    }
})

//UPDATE or PATCH call
app.patch('/books/:id', (req, res) => {
    if (ObjectID.isValid(req.params.id)) {
        db.collection('books')
            .updateOne({ _id: ObjectID(req.params.id) }, { $set: req.body })
            .then(result => {
                res.status(200).json(result)
            })
            .catch(error => {
                res.status(500).json({ error: "Internal Server Error" })
            })
    } else {
        res.status(500).json({ error: "Id Missmatched" })
    }
})
