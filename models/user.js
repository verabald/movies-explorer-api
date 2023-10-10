const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { req } = require('../constants/schema');
const UnauthorizedError = require('../constants/status/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Александр',
    minlength: [2, 'Текст должен быть длиннее 2 символов'],
    maxlength: [30, 'Текст не может быть длиннее 30 символов'],
  },
  email: {
    type: String,
    required: req,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректная почта',
    },
  },
  password: {
    type: String,
    required: req,
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
