const dotenv = require('dotenv');
const fs = require('fs');
require('colors');

// model
const Task = require('../../models/Task');

// database connection
const connectDB = require('../../startup/db');

dotenv.config({ path: './variables.env' });

// db local
const db = process.env.DATABASE_LOCAL;

// mongo atlas
const mongoUri = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// MongoDB connection
connectDB(mongoUri);

// read JSON file
const tasks = JSON.parse(fs.readFileSync(`${__dirname}/tasks.json`, 'utf-8'));

// import data into database
const loadData = async () => {
    try {
        await Task.create(tasks);
        console.log('👍👍👍👍👍👍👍👍 Done!'.green.bold);
        process.exit();
    } catch (e) {
        console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run blowitallaway\n\n\n'.red.bold);
        console.log(e);
        process.exit();
    }
};

// delete data from database
const removeData = async () => {
    try {
        console.log('😢😢 Goodbye Data...');
        await Task.deleteMany();
        console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n'.green.bold);
        process.exit();
    } catch (e) {
        console.log(e);
        process.exit();
    }
};

if (process.argv[2] === '--import') {
    loadData();
} else if (process.argv[2] === '--delete') {
    removeData();
}
