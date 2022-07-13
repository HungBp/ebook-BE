const express = require("express");
const { MongoClient, ObjectId, Timestamp } = require('mongodb');

const router = express.Router();
// parameter for connect mongodb
const uri = "mongodb+srv://hung:kiculdms@ebook.o6rmm.mongodb.net/?retryWrites=true&w=majority";
const dbName = "my-database";
const colName = "ebook";
const client = new MongoClient(uri);

const timeZoneOption = {
  dateStyle: "full",
  timeStyle: "medium",
  timeZone: "Asia/Saigon",
  hour12: false
};

// request to db
function reqDb(fn) {
  client.connect()
    .then(() => {
      return client.db(dbName).collection(colName);
    })
    .then((col) => {
      fn(col);
    })
    .catch((err) => {
      console.log(err);
    });
}

// middleware

// find one

// find all
router.get("/", (req, res) => {
  reqDb((col) => {
    col.find().toArray()
      .then((doc) => {
        console.log("All books loaded!!!");
        res.setHeader("Content-Type", "application/json").json(doc);
      });
  });
});

// post one
router.post("/", (req, res) => {
  reqDb((col) => {
    col.insertOne({...req.body, ...{createAt: new Date().toLocaleString("en", timeZoneOption)}})
      .then((doc) => {
        return col.findOne({_id: doc.insertedId})
      })
      .then((doc) => {
        res.setHeader("Content-Type", "application/json").send(JSON.stringify(doc));
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

//delete one
router.delete("/:id", (req, res) => {
  reqDb((col) => {
    col.deleteOne({_id: new ObjectId(req.params.id)})
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

// delete all
// router.delete("/", (req, res) => {
//   reqDb((col) => {
//     col.deleteMany()
//       .then((doc) => {
//         console.log(`Delete ${doc.deletedCount} books`);
//         res.json(doc);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   });
// });

module.exports = router;