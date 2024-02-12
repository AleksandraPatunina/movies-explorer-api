const mongoose = require('mongoose');
const { regexForUrl } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        return regexForUrl.test(url);
      },
      message: 'Пожалуйста, введите URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        return regexForUrl.test(url);
      },
      message: 'Пожалуйста, введите URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(url) {
        return regexForUrl.test(url);
      },
      message: 'Введите URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // уникальный идентификатор
    ref: 'user', // ссылаюсь на user
    required: true,
  },
  movieId: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);

// Значения полей:
// country — страна создания фильма
// director — режиссёр фильма.
// duration — длительность фильма.
// year — год выпуска фильма.
// description — описание фильма.
// image — ссылка на постер к фильму.
// trailerLink — ссылка на трейлер фильма.
// thumbnail — миниатюрное изображение постера к фильму.
// owner — _id пользователя, который сохранил фильм.
// movieId — id фильма, который содержится в ответе сервиса MoviesExplorer.
// nameRU — название фильма на русском языке.
// nameEN — название фильма на английском языке.
