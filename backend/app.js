require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./src/config/logger-config');
const { initializeFirebase } = require('./src/config/firebase-config');
const errorHandler = require('./src/middlewares/error-handler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeFirebase();

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = app;