const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  // Get the token from the request headers or other sources
  console.log("req.cookies", req.cookies);
  const token = req.cookies["admin-cookie"];

  // Check if the token is present
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    // Attach the decoded payload to the request object for further use
    req.admin = decoded;

    // Continue to the next middleware or route handler
    next();
  });
};

module.exports = verifyToken;
