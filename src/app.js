require('dotenv').config();
const express = require("express");
const path = require("path");
const adminRouter = require("./routes/adminRoute");
const bookRouter = require("./routes/bookRoute");
if (process.env.NODE_ENV !== "production") {
  const cors = require("cors");
}

const app = express();
// size limit when upload file to server
const sizeLimit = "1mb";

// middleware
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname,"../FE/build")));
} else {
  app.use(cors());
}
// Ref: https://stackoverflow.com/questions/54016068/empty-body-in-fetch-post-request => solved issue: req.body is empty
app.use(express.json({ type: ['application/json', 'text/plain'], limit: sizeLimit }));

// admin route
app.use("/admin", adminRouter);

// book route
app.use("/book", bookRouter);

if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => res.sendFile(path.join(__dirname,"../FE/build/index.html")));
}

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));