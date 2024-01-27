const express = require("express"),
  router = express.Router();

router.use("/admin", require("./admin"));

module.exports = router;
