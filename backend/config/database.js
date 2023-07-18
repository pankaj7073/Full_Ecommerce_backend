const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`database is connected ${data.connection.host}`);
  });
};

module.exports = connectDatabase;
