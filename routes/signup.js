const router = require('express').Router();
const { regValid } = require('../validation/users');
const { createUser } = require('../controllers/users');

router.post('/signup', regValid, createUser);

module.exports = router;
