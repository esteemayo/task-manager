const dotenv = require('dotenv');
require('colors');

const connectDB = require('./startup/db');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION 🔥! Shutting down...'.red.bold);
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './variables.env' });
const app = require('./app');

// db local
const db = process.env.DATABASE_LOCAL;

// mongo atlas
const mongoUri = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

app.set('port', process.env.PORT || 8080);

const start = async () => {
    try {
        await connectDB(mongoUri);

        const server = app.listen(app.get('port'), () => {
            console.log(`App listening on port → ${server.address().port}`.blue.bold);
        });
    } catch (e) {
        console.log(e);
    }
};

start();
