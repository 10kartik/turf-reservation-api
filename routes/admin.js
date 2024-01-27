const express = require("express"),
  router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const rootPrefix = "..",
  adminModel = require(rootPrefix + "/db/models/admin"),
  jwtVerifyToken = require(rootPrefix + "/helpers/jwt");

// Define routes.
router.get("/login", async function (req, res) {
  const username = req.body.username,
    password = req.body.password;

  console.log("username and password", username, password);

  const adminRecord = await adminModel.findOne({ username: username });

  console.log("admin record from db", adminRecord);

  const isMatch = await bcrypt.compare(password, adminRecord.passwordHash);

  if (isMatch) {
    const admin = {
      id: adminRecord._id,
      username: username,
    };

    const token = jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("admin-cookie", token, {
      maxAge: 900000,
      httpOnly: true,
    });

    res.send({ success: true });
  } else {
    res.send({
      success: false,
      message: "Login failed - Invalid Crendentials",
    });
  }
});

router.use(cookieParser());
router.use(jwtVerifyToken);

router.get("/check", function (req, res) {
  res.send({ success: true });
});

router.post("/logout", function (req, res) {
  res.clearCookie("admin-cookie");
  res.send({ success: true });
});

module.exports = router;
