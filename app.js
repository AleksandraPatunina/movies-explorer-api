require('dotenv').config();
const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(helmet());

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

// подключение к серверу mongo
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(limiter);

app.use('/', require('./routes/index'));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
