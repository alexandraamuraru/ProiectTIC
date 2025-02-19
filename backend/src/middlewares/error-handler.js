const logger = require('../config/logger-config');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);

    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;