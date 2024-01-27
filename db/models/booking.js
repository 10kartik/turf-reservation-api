const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  guestName: {
    type: String,
    required: true,
  },
  guestPhone: {
    type: String,
    required: true,
  },
  guestEmail: {
    type: String,
    required: true,
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admins",
    required: true,
  },
  timeSlot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeSlots",
    required: true,
  },
  attendees: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "booked"],
    default: "pending",
  },
});

const schemaName = `bookings`;

module.exports = mongoose.model(schemaName, bookingSchema);
