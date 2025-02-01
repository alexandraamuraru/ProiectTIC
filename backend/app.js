require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./src/config/logger-config');
const { initializeFirebase } = require('./src/config/firebase-config');
const errorHandler = require('./src/middlewares/error-handler');

const authRoutes = require('./src/routes/auth-routes');
const userRoutes = require('./src/routes/users-routes');
const bookRoutes = require('./src/routes/books-routes');
const loanRoutes = require('./src/routes/loans-routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initializeFirebase();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = app;