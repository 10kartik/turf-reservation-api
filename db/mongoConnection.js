const mongoose = require("mongoose");

class MongoDBConnection {
  constructor() {
    this.createConnection();
  }

  async createConnection() {
    // Get DB configs from environment properties file
    let connectionString = process.env.MONGODB_CONNECTION_STRING;
    connectionString =
      connectionString + process.env.APP_NAME + "-" + process.env.DB_SUFFIX;

    if (!connectionString) {
      throw new Error("MongoDB connection string not found");
    }

    const dbOptions = {
      autoIndex: true, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    try {
      mongoose.set("strictQuery", true);
      await mongoose.connect(connectionString, dbOptions);

      // Check if the database exists, and if not, create it
      const admin = mongoose.connection.db.admin();
      const databaseName = process.env.APP_NAME + "-" + process.env.DB_SUFFIX;
      const databases = await admin.listDatabases();
      const databaseExists = databases.databases.some(
        (db) => db.name === databaseName
      );

      if (!databaseExists) {
        console.log(`Database "${databaseName}" does not exist. Creating...`);
        await admin.createDatabase(databaseName);
        console.log(`Database "${databaseName}" created successfully.`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = new MongoDBConnection();
