const express = require('express');

const router = express.Router();
const { registerUser, loginUser } = require('../../controllers/users.controllers');

router.post('/users', registerUser);
router.post('/login', loginUser);

module.exports = router;
