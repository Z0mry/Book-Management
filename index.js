
import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import pg from "pg";
import axios from "axios";

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'library',
  password: '11990000',
  port: 5432,
});

db.connect();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const dbResult = await db.query("SELECT * FROM books");
    const books = dbResult.rows;

    res.render("index.ejs", { books });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get("/all", async (req, res) => {
  try {
    const dbResult = await db.query("SELECT * FROM books");
    const books = dbResult.rows;

    res.render("books.ejs", { books });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/books", async (req, res) => {
  try {
    const { title, author, notes, ratings } = req.body;

    const result = await db.query(
      "INSERT INTO books (title, author, notes, ratings) VALUES ($1, $2, $3, $4)",
      [title, author, notes, ratings]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("DELETE FROM books WHERE id = $1", [id]);

    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
