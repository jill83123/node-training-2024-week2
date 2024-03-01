const mongoose = require('mongoose');
require('dotenv').config();

function connectMongodb(dbName) {
  mongoose
    .connect(process.env[`DATABASE_${dbName}`])
    .then(() => {
      console.log('mongodb 連線成功');
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = connectMongodb;
