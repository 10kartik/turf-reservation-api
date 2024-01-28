const express = require("express"),
  router = express.Router();

router.use("/admin", require("./admin"));

router.use("/bookings", require("./booking"));

module.exports = router;
