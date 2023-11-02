const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;
const validator = require('validator');
const { regexRu } = require('../constants/regex');
const { regexEn } = require('../constants/regex');
const { req } = require('../constants/schema');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: req,
    validate: {
      validator(v) {
        return regexRu.test(v);
      },
    },
  },
  nameEN: {
    type: String,
    required: req,
    validate: {
      validator(v) {
        return regexEn.test(v);
      },
    },
  },
  country: {
    type: String,
    required: req,
  },
  director: {
    type: String,
    required: req,
  },
  duration: {
    type: Number,
    required: req,
  },
  year: {
    type: String,
    required: req,
  },
  description: {
    type: String,
    required: req,
  },
  image: {
    type: String,
    required: req,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  trailerLink: {
    type: String,
    required: req,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  thumbnail: {
    type: String,
    required: req,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: ObjectId,
    ref: 'user',
    required: req,
  },
  movieId: {
    type: Number,
    required: req,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
