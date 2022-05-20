'use strict';

const hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const geolocate = require('hapi-geo-locate');
const path = require('path');

const init = async () => {
    const server = hapi.server({
        port: 1234,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    });

    await server.register([
        {
            plugin: geolocate,
            options: {
                enabledByDefault: true
            }
        },
        {
            plugin: inert,
            options: {

            }
        }
    ]);

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, h) => {
                return h.file('welcome.html');
            }
        },
        {
            method: 'GET',
            path: '/location',
            handler: (request, h) => {
                if (request.location) {
                    return request.location;
                } else {
                    return '<h1>No location found</h1>';
                }
            }
        },
        {
            method: 'GET',
            path: '/users',
            handler: (request, h) => {
                return `<h1>USERS PAGE</h1>`;
            }
        },
        {
            method: 'GET',
            path: '/{any*}',
            handler: (request, h) => {
                return `<h1>Oh no! You must be lost!</h1>`;
            }
        }
    ]);

    await server.start();
    console.log('Server running on: ', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
})

init();