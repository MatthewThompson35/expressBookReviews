const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
public_users.get('/', async function (req, res) {
  try {
    const fetchBooks = await new Promise((resolve, reject) => {
      resolve(books);
    });

    res.status(200).send(JSON.stringify(fetchBooks, null, 4));
  } catch (err) {
    res.status(500).json({ message: "Error fetching books", error: err.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  var isbn = req.params.isbn
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    var author = req.params.author
    var bookKeys = Object.keys(books)
    console.log(req.params.author);
    var list = [];
    for(let i = 0; i < bookKeys.length; i++){
    let currentBook = bookKeys[i];
    console.log(books[bookKeys[i]].author);
    if (books[currentBook].author.toLowerCase() === author.toLowerCase()) {
        list.push(books[currentBook]);
    }
    }
    return res.status(200).send(JSON.stringify(list, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    var title = req.params.title.replace(/%20/g, ' ');
    var bookKeys = Object.keys(books)
    var list = [];
    for(let i = 0; i < bookKeys.length; i++){
    let currentBook = bookKeys[i];
    if (books[currentBook].title.toLowerCase() === title.toLowerCase()) {
        list.push(books[currentBook]);
    }
    }
    return res.status(200).send(JSON.stringify(list, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    var isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
