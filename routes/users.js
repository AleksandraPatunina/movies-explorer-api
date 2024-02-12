const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexForEmail } = require('../utils/constants');
const { editUserData, getMeUser } = require('../controllers/users');

router.get('/me', getMeUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(), // обязательные поля
    email: Joi.string().pattern(regexForEmail).required(), // обязательные поля
  }),
}), editUserData);

module.exports = router;

// GET /users/me- возвращает информацию о пользователе (email и имя)
// PATCH /users/me - обновляет информацию о пользователе (email и имя)
