const router = require('express').Router();
const { createMovieValid, deleteMovieValid } = require('../validation/movies');
const {
  getMovie,
  postMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovie);
router.post('/', createMovieValid, postMovie);
router.delete('/:movieId', deleteMovieValid, deleteMovie);

module.exports = router;
