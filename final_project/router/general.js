const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username=req.body.username;
  let password=req.body.password;
  const allUsers = Object.values(users);
  const filteredUsers = allUsers.filter(user => user.username === username);
  if(username=="" || password==""){
    return res.status(404).json({message: "username and/or password is not provided"});
  }else if(filteredUsers.length>0){
        return res.status(404).json({message: "username already exists"});
    }else{
        users.push({"username" : username,"password" : password})
        return res.status(200).json({ message: "user added successfully" });
        
}});


public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const allBooks = Object.values(books); // Convert books object to an array
    const filteredBooks = allBooks.filter(book => book.author === author);
  
    if (filteredBooks.length > 0) {
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  });
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const allBooks = Object.values(books); // Convert books object to an array
    const filteredBooks = allBooks.filter(book => book.title === title);
  
    if (filteredBooks.length > 0) {
      return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn=req.params.isbn;
  if(books[isbn]){
    if(books[isbn].reviews.length>0){
    return res.status(200).send(JSON.stringify(books[isbn].reviews));
  }else{return res.status(404).json({ message: "No reviews found for this book" });}
}else{
  return res.status(404).json({message: "book not found"});
}});

module.exports.general = public_users;
