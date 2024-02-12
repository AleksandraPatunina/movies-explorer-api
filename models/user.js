const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UnautorizedError = require('../errors/UnautorizedError');
const { regexForEmail } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    unique: true,
    validate: {
      validator(email) {
        return regexForEmail.test(email);
      },
      message: 'Введите верный email',
    },
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля - 2'],
    maxlength: [30, 'Максимальная длина поля - 30'],
    required: [true, 'Поле должно быть заполнено'],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = async function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnautorizedError('Неправильно указаны почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnautorizedError('Неправильно указаны почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
