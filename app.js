const hpp = require('hpp');
const cors = require('cors');
const YAML = require('yamljs');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUI = require('swagger-ui-express');
const { StatusCodes } = require('http-status-codes');
const mongoSanitize = require('express-mongo-sanitize');

const swaggerDocument = YAML.load('./swagger.yaml');

// routes
const tasks = require('./routes/tasks');
const NotFoundError = require('./errors/notFound');
const globalErrorHandler = require('./controllers/errorController');

// start express app
const app = express();

// global middlewares
app.set('trust proxy', 1);

// implement CORS
app.use(cors());
// access-control-allow-origin
app.options('*', cors());

// set security HTTP headers
app.use(helmet());

// development logging
if (app.get('env') === 'development') {
    app.use(morgan('dev'));
}

// limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(hpp());

// compression middleware
app.use(compression());

// test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.status(StatusCodes.OK).send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

// api route
app.use('/api/v1/tasks', tasks);

app.all('*', (req, res, next) => {
    next(new NotFoundError(`Can't find ${req.originalUrl} on this server.`));
});

app.use(globalErrorHandler);

module.exports = app;
