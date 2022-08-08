const express = require("express");
const { MongoClient, ObjectId } = require('mongodb');
const router = express.Router();
const authRequire = require("../middleware/authRequire.js");

// parameter for connect mongodb
const dbName = "my-database";
const colName = "ebook";
const client = new MongoClient(process.env.MONGODB_URI);

// const timeZoneOption = {dateStyle: "full", timeStyle: "medium", timeZone: "Asia/Saigon", hour12: false};

// request to db
function reqDb(fn) {
  client.connect()
    .then(() => client.db(dbName).collection(colName))
    .then(col => {
      if (!col) {throw new Error("Database does not exist");}
      return fn(col);
    });
}

// find all
router.get("/", (req, res) => {
  reqDb(col => {
    col.find().toArray()
      .then(doc => res.setHeader("Content-Type", "application/json").json(doc))
      .catch(err => res.status(400).json({error: err.message}));
  });
});

// post one
router.post("/", authRequire, (req, res) => {
  reqDb(col => {
    // col.insertOne({...req.body, ...{createAt: new Date().toLocaleString("en", timeZoneOption)}})
    col.insertOne(req.body)
      .then(doc => col.findOne({_id: doc.insertedId}))
      .then(doc => res.setHeader("Content-Type", "application/json").send(JSON.stringify(doc)))
      .catch(err => res.status(400).json({error: err.message}));
  });
});

// delete one
router.delete("/:id", authRequire, (req, res) => {
  reqDb(col => {
    col.deleteOne({_id: new ObjectId(req.params.id)})
      .then(doc => res.json(doc))
      .catch(err => res.status(400).json({error: err.message}));
  });
});

module.exports = router;