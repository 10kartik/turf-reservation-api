const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    index: true,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "booked"],
    default: "available",
  },
  bookingsId: {
    type: String,
    required: true,
  },
});

const schemaName = `timeSlot`;

module.exports = mongoose.model(schemaName, timeSlotSchema);
