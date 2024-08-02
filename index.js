require('dotenv').config();
const express = require('express')

const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/raktim", (req, res) => {
    res.send("Hello from Raktim!");
  });

app.listen(process.env.Raktim, () => {
  console.log(`Express server running at http://localhost:${process.env.Raktim}/`);
});