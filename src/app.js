const express = require("express");
const path = require("path");
const cors = require("cors");
const bookRouter = require("./routes/bookRoute");

const app = express();
const port = 4000;
// size limit when upload file to server
const sizeLimit = "1mb";

// middleware
app.use(cors());
// Ref: https://stackoverflow.com/questions/54016068/empty-body-in-fetch-post-request => solved issue: req.body is empty
app.use(express.json({ type: ['application/json', 'text/plain'], limit: sizeLimit }));
app.use("/book", bookRouter);
app.get("/", (req, res) => {res.sendFile(path.join(__dirname,"../../FE/build/index.html"));});
app.listen(port, () => { console.log(`Listening on ${port}`); });

  // user login ==> post book, buy book