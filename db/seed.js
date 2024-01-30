require("dotenv").config();
const adminModel = require("./models/admin");
const mongoConnection = require("./mongoConnection");
mongoConnection;

const bcrypt = require("bcryptjs");

const saltRounds = 10;

const adminData = [
  {
    username: "admin_1",
    name: "Tars",
    phone: "1234567890",
    email: "admin_1@email.com",
    password: "password_admin_1",
  },
  {
    username: "admin_2",
    name: "Case",
    phone: "9876543210",
    email: "admin_2@email.com",
    password: "password_admin_2",
  },
];

const seedAdmin = async () => {
  try {
    await adminModel.deleteMany({});
    console.log("Existing admins deleted");

    for (const admin of adminData) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(admin.password, salt);

      const newAdmin = new adminModel({
        username: admin.username,
        name: admin.name,
        phone: admin.phone,
        email: admin.email,
        passwordHash: hash,
      });

      await newAdmin.save();
      console.log(`Admin ${admin.username} saved`);
    }

    console.log("All admins saved");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    process.exit();
  }
};

seedAdmin();
