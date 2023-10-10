const movieSchema = require('../models/movie');

const NotFoundError = require('../constants/status/NotFoundError');
const ForbiddenError = require('../constants/status/ForbiddenError');
const BadRequestError = require('../constants/status/BadRequestError');
const { STATUS_CREATED } = require('../constants/status/status');

function getMovie(req, res, next) {
  movieSchema.find({}).sort({ createdAt: -1 })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
}

function postMovie(req, res, next) {
  const {
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
  } = req.body;

  movieSchema.create({
    nameRU,
    nameEN,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(STATUS_CREATED).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  const { movieId } = req.params;

  movieSchema.findById(movieId)
    .orFail(
      new NotFoundError(
        'Фильм с указанным _id не найден',
      ),
    )
    .then((movie) => {
      if (String(movie.owner._id) !== req.user._id) {
        throw new ForbiddenError('Вы не можете удалить чужой фильм');
      } else {
        movieSchema.findByIdAndRemove(String(req.params.movieId))
          .then((result) => {
            res.send({ data: result });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              return next(new BadRequestError('Введены некорректные данные'));
            }
            return next(err);
          });
      }
    })
    .catch(next);
}

module.exports = {
  getMovie,
  postMovie,
  deleteMovie,
};
