require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const limiter = require('./middlewares/rateLimiter');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorServer = require('./middlewares/errors');

const router = require('./routes/index');

const { PORT = 3000, URL = 'mongodb://127.0.0.1/filmsdb' } = process.env;

const app = express();

mongoose.connect(URL);

app.use(express.json());

app.use(helmet());

app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorServer);

app.listen(PORT);
