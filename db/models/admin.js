const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: false,
  },
  password_hash: {
    type: String,
    required: true,
    alias: "passwordHash",
  },
});

const schemaName = `admin`;

module.exports = mongoose.model(schemaName, adminSchema);
