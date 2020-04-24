// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const bodyParse = require("body-parser");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

app.set("view engine", "pug");
app.set("views", "./views")

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: true }));

//set defaults db
db.defaults('db.json').write();

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.send("Welcome to Bookstore!!<br><a href='/books' >Tới trang admin</a>")
});

// send the default array of dreams to the webpage
app.get("/books", (req, res) => {  
  res.render("books/index", {
    books: db.get("books_list").value()
  });
});

// load info a edit book
app.get("/books/:id/edit", (req, res) => {
  var id = parseInt(req.params.id);
  var book_edit_arr = [];
  book_edit_arr.push(db.get("books_list").find({id : id}).value());
      
  res.render("books/edit", {
    book_edit : book_edit_arr 
  })
})

// save edit
app.post("/books/save_edit", (req, res) => {
  var id = parseInt(req.body.id);
  var item_edit = db.get('books_list').find({ id: id }).value();
  item_edit.title = req.body.title;
  item_edit.description = req.body.description;
  
  res.redirect("/books")
});

// delete a book
app.get("/books/:id/delete", (req, res) => {
  var id = parseInt(req.params.id);
  var book_match = db.get("books_list").find({id : id}).value();
  
  db.get("books_list").remove(book_match).write();
  res.redirect("/books");
})

// create new book
app.post("/books/create", (req, res) => {
  var value_booksList = db.get('books_list').value();
  var id_last_book = value_booksList[value_booksList.length - 1].id;
  req.body.id = id_last_book + 1;
  
  db.get("books_list").push(req.body).write();
  res.redirect("/books")
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
