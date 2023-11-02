const router = require('express').Router();
const { logValid } = require('../validation/users');
const { loginUser } = require('../controllers/users');

router.post('/signin', logValid, loginUser);

module.exports = router;
