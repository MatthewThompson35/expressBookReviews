const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    var username = req.body.username;
    var password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    var userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  });


// Get the book list available in the shop
// Get all books - serves as the data source
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error('No books found'));
      }
    });
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book by ISBN - uses Axios
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get('http://localhost:5000/');
    const book = response.data[isbn];
    if (book) {
      res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      res.status(404).json({ message: `No book found for ISBN: ${isbn}` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book by Author - uses Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get('http://localhost:5000/');
    const matchingBooks = Object.values(response.data).filter(
      (book) => book.author === author
    );
    if (matchingBooks.length > 0) {
      res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      res.status(404).json({ message: `No books found for author: ${author}` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book by Title - uses Axios
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get('http://localhost:5000/');
    const matchingBooks = Object.values(response.data).filter(
      (book) => book.title === title
    );
    if (matchingBooks.length > 0) {
      res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
      res.status(404).json({ message: `No books found for title: ${title}` });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    var isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
