const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { addUser } = require('../controllers/users');
const { regexForEmail } = require('../utils/constants');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().pattern(regexForEmail),
    password: Joi.string().required(),
  }),
}), addUser);

module.exports = router;
