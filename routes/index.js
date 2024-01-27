const express = require("express"),
  router = express.Router();

const rootPrefix = "../",
  sanitizer = require(rootPrefix + "/helpers/sanitizer");

// Define routes.
router.get("/", function (req, res) {
  res.send("Hello World!");
});

module.exports = router;
