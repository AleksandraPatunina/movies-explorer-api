const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexForUrl } = require('../utils/constants');
const { addMovie, getMovies, deleteMovie } = require('../controllers/movies');

router.get('/', getMovies);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regexForUrl),
    trailerLink: Joi.string().required().pattern(regexForUrl),
    thumbnail: Joi.string().required().pattern(regexForUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), addMovie);

module.exports = router;

// GET /movies возвращает все сохранённые текущим пользователем фильмы
// POST /movies создаёт фильм с переданными в теле
// country, director, duration, year, description, image, trailer, nameRU, nameEN
// и thumbnail, movieId
// DELETE /movies/_id удаляет сохранённый фильм по id
