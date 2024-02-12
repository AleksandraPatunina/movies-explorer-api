const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('http2').constants;
const mongoose = require('mongoose');
const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(error.message));
      } else {
        next(error);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(HTTP_STATUS_OK).send(movies))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (!movie) { // Проверяю, существует ли карточка с фильмом
        throw new NotFoundError(`Фильм с _id: ${req.params.movieId} не найден.`);
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Карточка с фильмом принадлежит другому пользователю');
      }
      Movie.deleteOne(movie)
        .orFail()
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Фильм успешно удален' });
        })
        .catch((error) => {
          if (error instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError(`Фильм с _id: ${req.params.movieId} не найден.`));
          } else if (error instanceof mongoose.Error.CastError) {
            next(new BadRequestError(`Некорректный _id фильма: ${req.params.movieId}`));
          } else {
            next(error);
          }
        });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError(`Фильм с _id: ${req.params.movieId} не найден.`));
      } else {
        next(error);
      }
    });
};
