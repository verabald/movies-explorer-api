const router = require('express').Router();
const { updateUserInfoValid } = require('../validation/users');
const {
  getUser,
  setInfo,
} = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', updateUserInfoValid, setInfo);

module.exports = router;
