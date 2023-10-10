const router = require('express').Router();
const routerUsers = require('./users');
const routerMovies = require('./movies');
const pageNotFound = require('./pageNotFound');
const routerSignin = require('./signin');
const routerSignup = require('./signup');
const auth = require('../middlewares/auth');

router.use('/', routerSignin);
router.use('/', routerSignup);
router.use(auth);
router.use('/users', routerUsers);
router.use('/movies', routerMovies);
router.use('/', pageNotFound);

module.exports = router;
