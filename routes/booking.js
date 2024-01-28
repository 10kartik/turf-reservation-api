const express = require("express"),
  app = express.Router();

const rootPrefix = "..",
  sanitizer = require(rootPrefix + "/helpers/sanitizer"),
  AdminModel = require(rootPrefix + "/db/models/admin"),
  BookingModel = require(rootPrefix + "/db/models/booking"),
  bookingConstants = require(rootPrefix +
    "/helpers/globalConstant/model/booking");

// API endpoint to retrieve available time slots for booking
app.get("/", async (req, res) => {
  // Retrieve query parameters
  const date = req.decodedParams.date;

  // fetch all records from booking model for given date
  const bookings = await BookingModel.find({ date: date });

  //iterate on Array bookings and create a map of date to array of bookings
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
  const adminRecords = await AdminModel.find({ _id: { $in: adminIds } }).select(
    "-password_hash"
  );

  // iterate on adminRecords and create a map of adminId to adminRecord
  const adminRecordsMap = {};
  adminRecords.forEach((adminRecord) => {
    // exclude passwordHash from adminRecord
    adminRecordsMap[adminRecord._id] = adminRecord;
  });

  // Return the available time slots as a JSON response
  res.status(200).json({
    success: true,
    data: {
      booking_by_date: bookingsMap,
      admin_by_id: adminRecordsMap,
    },
  });
});

// API endpoint to create a new booking
app.post("/", (req, res) => {
  // Retrieve the booking details from the request body
  const {
    guest_name,
    guest_phone,
    guest_email,
    attendees,
    date,
    start_time,
    end_time,
    sports,
  } = req.body;

  // Perform logic to create a new booking based on the provided details

  // Return the booking ID as a JSON response
  res.status(201).json({
    success: true,
    data: {
      booking_id: "1a2b3c",
    },
  });
});

// API endpoint to confirm payment for a booking
app.put(
  "/:bookingId/confirm-payment",
  sanitizer.sanitizeDynamicUrlParams,
  (req, res) => {
    // Retrieve the booking ID from the path parameters
    const { bookingId } = req.params;

    // Perform logic to confirm payment for the specified booking

    // Return a success response
    res.status(200).json({
      success: true,
    });
  }
);

module.exports = app;
