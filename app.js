require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { rateLimit } = require('express-rate-limit');
const { errors } = require('celebrate');

const cors = require('./middlewares/cors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorServer = require('./middlewares/errors');

const { regValid, logValid } = require('./validation/users');

const routerUsers = require('./routes/users');
const routerMovies = require('./routes/movies');
const pageNotFound = require('./routes/pageNotFound');

const { createUser, loginUser } = require('./controllers/users');

const { PORT = 3000, URL = 'mongodb://127.0.0.1/filmsdb' } = process.env;

const app = express();

mongoose.connect(URL);

app.use(express.json());

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use(requestLogger);
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors);

app.post(
  '/signup',
  regValid,
  createUser,
);

app.post(
  '/signin',
  logValid,
  loginUser,
);

app.use(auth);

app.use('/users', routerUsers);
app.use('/movies', routerMovies);
app.use('/', pageNotFound);

app.use(errorLogger);

app.use(errors());
app.use(errorServer);

app.listen(PORT);
