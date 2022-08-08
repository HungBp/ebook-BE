const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const router = express.Router();

// parameter for connect mongodb
const dbName = "my-database";
const colName = "user";
const client = new MongoClient(process.env.MONGODB_URI);

// request to db
function reqDb(fn) {
  client.connect()
    .then(() => client.db(dbName).collection(colName))
    .then(col => {
      if (!col) {throw new Error("Database does not exist");}
      return fn(col);
    });
}

// signup

// login
router.post("/login", (req, res) => {
  const user = req.body;

  reqDb((col) => {
    col.findOne({username: user.username})
      .then(doc => {
        if (user.username === "admin") {
          if (doc) {
            // already have admin
            if (bcrypt.compareSync(user.password, doc.password)) {
              const token = jwt.sign(JSON.stringify({id: doc._id}), process.env.SECRET_KEY);
              col.updateOne({_id: new ObjectId(doc._id)}, {$set: {token}});
              res.json({token});
            } else {
              throw new Error("Wrong password");
            }
          } else {
            // create new admin
            user.password = bcrypt.hashSync(user.password, 10);
            col.insertOne(user);
            res.end();
          }
        } else {
          throw new Error("Username must be admin");
        }
      })
      .catch(err => res.status(400).json({error: err.message}));
  });
});

// logout


module.exports = router;