const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { SECRET_KEY = 'diplom-movies-key' } = process.env;
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

module.exports.getMeUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(next);
};

module.exports.editUserData = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
      } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по указанному _id: ${req.user._id} не найден.`));
      } else {
        next(error);
      }
    });
};

module.exports.addUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => res.status(HTTP_STATUS_CREATED).send({
        name: user.name, _id: user._id, email: user.email,
      }))
      .catch((error) => {
        if (error.code === 11000) {
          next(new ConflictError(`Пользователь с email: ${email} уже зарегистрирован`));
        } else if (error instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError(error.message));
        } else {
          next(error);
        }
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((error) => {
      next(error);
    });
};
