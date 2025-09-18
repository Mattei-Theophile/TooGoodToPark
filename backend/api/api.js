const Database = require('../database/database')
const fs = require('fs')
const express = require('express')
const path = require('path')
const colors = require('colors')

/*
The verbs map to CRUD operations
    GET retrieves resources.
    POST submits new data to the server.
    PUT updates existing data.
    DELETE removes data.
 */

class Api {
    constructor(app) {
        this.app = app;
        this.routes = express.Router()
    }

    async start() {
        this.loadsRoute()
    }

    loadsRoute() {
        // Load and register routes from the routes directory
        fs.readdirSync(path.join(__dirname, '/routes')).forEach(file => {
            const routeModule = require(path.join(__dirname, '/routes', file));
            console.log(colors.magenta(`Loading routes from file: ${file}`));

            // Iterate through HTTP methods (get, post, etc.)
            for (const name in routeModule) {

                if (routeModule[name] && routeModule[name].method && routeModule[name].route && routeModule[name].action) {
                    const {method, route, action} = routeModule[name];
                    const methodLower = method.toLowerCase();
                    const methodColored = (
                        methodLower === 'get' ? colors.cyan(method.toUpperCase()) :
                        methodLower === 'post' ? colors.green(method.toUpperCase()) :
                        methodLower === 'put' ? colors.yellow(method.toUpperCase()) :
                        methodLower === 'delete' ? colors.red(method.toUpperCase()) :
                        colors.white(method.toUpperCase())
                    );
                    console.log(`${colors.gray('Registering')} ${methodColored} ${colors.white(route)}`);
                    // Register the route with the appropriate HTTP method
                    switch (method.toLowerCase()) {
                        case 'get':
                            this.routes.route(route).get(action);
                            break;
                        case 'post':
                            this.routes.route(route).post(action);
                            break;
                        case 'put':
                            this.routes.route(route).put(action);
                            break;
                        case 'delete':
                            this.routes.route(route).delete(action);
                            break;
                        default:
                            console.warn(`Unsupported HTTP method: ${method}`);

                    }
                }
            }
            console.log(`Routes loaded from file: ${file}`);
        })

        this.app.use('/api', this.routes)
    }
}

module.exports = {Api};