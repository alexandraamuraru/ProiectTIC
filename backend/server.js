const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
  
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something went wrong');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

module.exports = app;