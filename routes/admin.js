const express = require("express"),
  router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const rootPrefix = "..",
  adminModel = require(rootPrefix + "/db/models/admin"),
  jwtVerifyToken = require(rootPrefix + "/helpers/jwt"),
  bookingModel = require(rootPrefix + "/db/models/booking"),
  bookingConstants = require(rootPrefix +
    "/helpers/globalConstant/model/booking");

// Define routes.
router.post("/login", async function (req, res) {
  const username = req.body.username,
    password = req.body.password;

  const adminRecord = await adminModel.findOne({ username: username });

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
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Incorrect username or password.",
    });
  }
});

router.use(cookieParser());
router.use(jwtVerifyToken);

// add current admin API route
router.get("/current", async function (req, res) {
  if (!req.admin) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. User not logged in.",
    });
  }
  const adminRecord = await adminModel
    .findOne({ _id: req.admin.id })
    .select("-password_hash");

  if (!adminRecord) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: adminRecord,
  });
});

router.post("/logout", function (req, res) {
  res.clearCookie("admin-cookie");
  return res.send({ success: true });
});

// add /bookings route Retrieve the list of pending bookings.
router.get("/bookings", async function (req, res) {
  const bookings = await bookingModel.find({
    status: bookingConstants.invertedStatuses[bookingConstants.pendingStatus],
  });

  // iterate on Array bookings and create a map of date to array of bookings
  const bookingsMap = {};
  let adminIds = [];

  bookings.forEach((booking) => {
    if (booking.adminId) adminIds.push(booking.adminId);

    if (!bookingsMap[booking.bookingDate]) {
      bookingsMap[booking.bookingDate] = [];
    }

    let bookingObj = booking.toObject();
    bookingObj.status = bookingConstants.statuses[String(booking.status)];

    bookingsMap[booking.bookingDate].push(bookingObj);
  });

  // filter duplicate adminIds
  adminIds = [...new Set(adminIds)];

  // fetch admin records from admin model
  const adminRecords = await adminModel
    .find({ _id: { $in: adminIds } })
    .select("-password_hash");

  // iterate on adminRecords and create a map of adminId to adminRecord
  const adminRecordsMap = {};
  adminRecords.forEach((adminRecord) => {
    // exclude passwordHash from adminRecord
    adminRecordsMap[adminRecord._id] = adminRecord;
  });

  return res.status(200).json({
    success: true,
    data: {
      booking_by_date: bookingsMap,
      admin_by_id: adminRecordsMap,
    },
  });
});

// add /api/admin/bookings/{bookingId}/confirm route to confirm a booking.
router.put("/bookings/:id/confirm", async function (req, res) {
  const bookingId = req.params.id;
  const admin = req.admin;

  let bookingRecord = await bookingModel.findOne({ _id: bookingId });

  if (!bookingRecord) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  if (
    bookingRecord.status !==
    Number(bookingConstants.invertedStatuses[bookingConstants.pendingStatus])
  ) {
    return res.status(409).json({
      success: false,
      message: "Booking already confirmed",
    });
  }

  bookingRecord = bookingRecord.toObject();
  bookingRecord.status =
    bookingConstants.invertedStatuses[bookingConstants.confirmedStatus];
  bookingRecord.admin_id = admin.id;

  await bookingModel.findOneAndUpdate({ _id: bookingId }, bookingRecord, {
    new: true,
  });

  return res.status(200).json({
    success: true,
  });
});

module.exports = router;
