const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');

const JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

const NotFoundError = require('../constants/status/NotFoundError');
const ConflictError = require('../constants/status/ConflictError');
const BadRequestError = require('../constants/status/BadRequestError');

const { STATUS_OK, STATUS_CREATED } = require('../constants/status/status');

function createUser(req, res, next) {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => userSchema.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(STATUS_CREATED).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  return userSchema.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.status(STATUS_OK).send({ token });
    })
    .catch(next);
}

function getUser(req, res, next) {
  userSchema.findById(req.user._id)
    .orFail(
      new NotFoundError(
        'Пользователь с указанным _id не найден',
      ),
    )
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
}

function setInfo(req, res, next) {
  const { name, email } = req.body;

  userSchema.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) return res.send({ data: user });

      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные'));
      }
      return next(err);
    });
}

module.exports = {
  createUser,
  loginUser,
  getUser,
  setInfo,
};
