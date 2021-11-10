const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url)
        .then(() => console.log(`Connected to MongoDB → ${url}`.gray.bold))
        .catch((err) => console.log(`Could not connect to the database → ${err}`.red.bold));
};

module.exports = connectDB;
