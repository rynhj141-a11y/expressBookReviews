const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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





public_users.get('/', async function (req, res) {
  try {
    
    const getBooks = () => {
        return new Promise((resolve, reject) => {
            if (books) {
                resolve(books);
            } else {
                reject("Books not found");
            }
        });
    };

    const bookList = await getBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
    
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error });
  }
});


public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const fetchBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
          resolve(book);
        } else {
          reject({ status: 404, message: "Book not found" });
        }
      });
    };

    // Await the promise resolution
    const bookDetails = await fetchBookByISBN(isbn);
    return res.status(200).json(bookDetails);

  } catch (error) {
    // Handle cases where the book is not found or other errors
    return res.status(error.status || 500).json({ 
      message: error.message || "Error fetching book details" 
    });
  }
});
  

// Task 12: Get book details based on Author using Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {

    const fetchBooksByAuthor = (authorName) => {
      return new Promise((resolve, reject) => {
        const bookEntries = Object.values(books);
        const filteredBooks = bookEntries.filter(book => book.author === authorName);

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject({ status: 404, message: "No books found by this author" });
        }
      });
    };


    const authorBooks = await fetchBooksByAuthor(author);
    

    return res.status(200).json(authorBooks);

  } catch (error) {
   
    return res.status(error.status || 500).json({ 
      message: error.message || "Error fetching books by author" 
    });
  }
});
// Task 13: Get book details based on Title using Async-Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    // 1. Create a promise to simulate an asynchronous search
    const fetchBooksByTitle = (bookTitle) => {
      return new Promise((resolve, reject) => {
        const bookEntries = Object.values(books);
        const filteredBooks = bookEntries.filter(book => book.title === bookTitle);

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject({ status: 404, message: "No books found with this title" });
        }
      });
    };

    // 2. Await the search results
    const titleBooks = await fetchBooksByTitle(title);
    
    // 3. Send the response
    return res.status(200).json(titleBooks);

  } catch (error) {
    return res.status(error.status || 500).json({ 
      message: error.message || "Error fetching books by title" 
    });
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
