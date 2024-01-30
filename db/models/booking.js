const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  guest_name: {
    type: String,
    required: true,
    alias: "guestName",
  },
  guest_phone: {
    type: String,
    required: false,
    alias: "guestPhone",
  },
  guest_email: {
    type: String,
    required: false,
    alias: "guestEmail",
  },
  booking_date: {
    type: String,
    required: true,
    index: true,
    alias: "bookingDate",
  },
  start_time: {
    type: String,
    required: true,
    alias: "startTime",
  },
  end_time: {
    type: String,
    required: true,
    alias: "endTime",
  },
  sport: {
    type: String,
    required: false,
  },
  attendees: {
    type: Number,
    required: false,
  },
  status: {
    type: Number,
    required: true,
  },
  admin_id: {
    type: String,
    required: false,
    alias: "adminId",
  },
});

// Compound index
bookingSchema.index({ date: 1, start_time: 1, end_time: 1 }, { unique: true });

const schemaName = `bookings`;

module.exports = mongoose.model(schemaName, bookingSchema);
