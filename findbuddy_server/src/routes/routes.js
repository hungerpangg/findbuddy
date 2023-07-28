const { Router } = require('express');
const controller = require('../controllers/controllers');

const router = Router();

router.post('/signup', controller.signup_post);

module.exports = router;