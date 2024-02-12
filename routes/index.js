const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
