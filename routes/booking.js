const express = require("express"),
  app = express.Router();

const rootPrefix = "..",
  AdminModel = require(rootPrefix + "/db/models/admin"),
  BookingModel = require(rootPrefix + "/db/models/booking"),
  bookingConstants = require(rootPrefix +
    "/helpers/globalConstant/model/booking");

// API endpoint to retrieve available time slots for booking
app.get("/", async (req, res) => {
  // Retrieve query parameters
  const date = req.decodedParams.date;

  console.log("date", date);
  // if date is not in format YYYY-MM-DD then return error
  if (!date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
    return res.status(400).json({
      success: false,
      error: {
        parameter: "date",
        message: "date should be in format YYYY-MM-DD",
      },
    });
  }

  // fetch all records from booking model for given date
  const bookings = await BookingModel.find({ booking_date: date });

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
app.post("/", async (req, res) => {
  // Retrieve the booking details from the request body
  let {
    guest_name,
    guest_phone,
    guest_email,
    attendees,
    booking_date,
    start_time,
    end_time,
    sport,
  } = req.decodedParams;

  start_time = parseInt(start_time);
  end_time = parseInt(end_time);

  // Perform logic to create a new booking based on the provided details
  // if date is not in format YYYY-MM-DD then return error
  if (!booking_date || !booking_date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
    return res.status(400).json({
      success: false,
      error: {
        parameter: "date",
        message: "date should be in format YYYY-MM-DD",
      },
    });
  }

  // if guest_name is not provided then return error
  if (!guest_name) {
    return res.status(400).json({
      success: false,
      error: {
        parameter: "guest_name",
        message: "guest_name is required",
      },
    });
  }

  if (!start_time || !end_time) {
    return res.status(400).json({
      success: false,
      error: {
        parameter: "start_time/end_time",
        message: "start_time and end_time are required",
      },
    });
  }

  // if start_time is between 0 to 23 and end_time is between 1 to 23
  // and start_time is less than end_time then return error
  if (
    start_time < 0 ||
    start_time > 23 ||
    end_time < 1 ||
    end_time > 23 ||
    start_time >= end_time
  ) {
    return res.status(400).json({
      success: false,
      error: {
        parameter: "start_time/end_time",
        message: "start_time should be less than end_time",
      },
    });
  }

  // if booking record already exists for given date, and start_time then return error
  const bookingRecordExists = await BookingModel.findOne({
    booking_date,
    start_time,
    end_time,
  });

  if (bookingRecordExists) {
    return res.status(400).json({
      success: false,
      error: {
        parameter: "booking",
        message: "booking already exists for given date and start_time",
      },
    });
  }

  const bookingRecord = await BookingModel.create({
    guest_name,
    guest_phone,
    guest_email,
    booking_date,
    start_time,
    end_time,
    attendees,
    sport,
    status: bookingConstants.invertedStatuses[bookingConstants.pendingStatus],
  });

  // if bookingRecord is not created then return error
  if (!bookingRecord) {
    return res.status(400).json({
      success: false,
      error: {
        parameter: "booking",
        message: "booking could not be created",
      },
    });
  }

  // Return the booking ID as a JSON response
  res.status(201).json({
    success: true,
    data: {
      booking_id: bookingRecord._id,
    },
  });
});

const ObjectId = require("mongoose").Types.ObjectId;

// add /api/booking/:bookingId route
app.get("/:id", async (req, res) => {
  // Retrieve the booking ID from the request URL
  const bookingId = req.params.id;

  // Perform logic to fetch the booking details based on the booking ID
  let bookingRecord = await BookingModel.findOne({
    _id: new ObjectId(bookingId),
  });

  // if bookingRecord is not found then return error
  if (!bookingRecord) {
    return res.status(400).json({
      success: false,
      error: {
        parameter: "booking",
        message: "booking not found",
      },
    });
  }

  bookingRecord = bookingRecord.toObject();
  bookingRecord.status =
    bookingConstants.statuses[String(bookingRecord.status)];

  // Return the booking details as a JSON response
  res.status(200).json({
    success: true,
    data: {
      booking: bookingRecord,
    },
  });
});

module.exports = app;
