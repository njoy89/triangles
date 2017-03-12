#!/usr/bin/env node

require('babel-core/register')({
    ignore: /node_modules|bower_components/
});
require('babel-polyfill');

const argv = require('minimist')(process.argv.slice(2));

try {
    process.env.NODE_ENV = require('../env');
} catch (e) {
    process.env.NODE_ENV = argv.env || argv.environment || 'production';
}

const config = require('config');
const debug = require('debug');
const http = require('http');

const app = require('./app');
const port = config.get('server.port');
app.set('port', port);

const server = http.createServer(app);

server.listen(port, config.get('server.host'));

server.on('error', function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            debug('error')(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            debug('error')(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;

    debug('info')('Listening on ' + bind);
});
