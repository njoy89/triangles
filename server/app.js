import config from 'config';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import headers from './middlewares/headers';

const app = express();

import api from './routes/api';
import index from './routes/index';

// Middleware
app.use(logger(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));
app.use(headers);

// Request routing
app.use('/api', api);
app.use('/', index);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error
    });
});

module.exports = app;
