require('dotenv').config();
const express = require('express');
const initinitializeDb = require('./database/connection.database').initializeDb;
const cors = require('cors');

const app = express();
const port = process.env.PORT;

initinitializeDb((error) => {
    if (error) {
        console.log(error);
        process.exit(1);
    } else {
        app.use(cors())
            .use(express.json())            
            .use(express.urlencoded({ extended: true }))
            .use('/api/v1', require('./routes'))
            .use(async (_req, _res, next) => {
                next({ status: 404, message: "Route not found." });
            })
            .use(async (err, req, res, _next) => {
                console.error(`Error at: "${req.originalUrl}": ${err.message}`);
                let message = err.message ? err.message : 'An unexpected error occurred.';
                res.status(err.status || 500)
                    .setHeader('Content-Type', 'application/json')
                    .json({ error: message });
            });

        app.listen(port, () => {
            console.log('Database connected and API is running.');
            if (process.env.NODE_ENV === 'development') {
                console.log(`http://localhost:${port}`);
            }
        });
    }
});