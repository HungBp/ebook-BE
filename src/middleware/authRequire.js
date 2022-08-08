const jwt = require("jsonwebtoken");

function authRequire(req, res, next) {
  try {
    const token = req.get("Authorization").split(" ");
    
    jwt.verify(token[1], process.env.SECRET_KEY);
    next();
  } catch(err) {
    if (err.name === "JsonWebTokenError") {throw new Error("Access denied");}
    else {throw err;}
  }
}

module.exports = authRequire;