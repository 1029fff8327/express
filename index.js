const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const winston = require('winston');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fileStorage';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Подключение логгера Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Middleware для логирования запросов
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Middleware для обработки CORS
app.use(cors());

// Подключение маршрутов
const fileRoutes = require('./routes/fileRoutes');
app.use('/file', fileRoutes);

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

module.exports = app;
