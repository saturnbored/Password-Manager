const express = require('express');
const router = express.Router();
const {addNewUser, loginUser} = require('../controllers/loginControllers');

router.route('/create/user/').post(addNewUser);

router.route('/login').post(loginUser);

module.exports = router;