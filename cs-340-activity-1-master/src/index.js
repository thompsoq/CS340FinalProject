/*
 * Most of this file is acquired from activity 1 as a setup. This file determines how the
 * applications responds to client requests and where information is routed to.
 */

/*
 * Handles routing table 
 */
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { createViewContext } = require('./utils');
const networkRouter = require('./routes/network');
const seriesRouter = require('./routes/series');
const reviewsRouter = require('./routes/reviews');
const writersRouter = require('./routes/writers');
const actorsRouter = require('./routes/actors');
const config = require('./config');

const PORT = process.env.PORT || 3000;

/*
 * Begin Express middleware
 */
const app = express();

/*
 * Set a location for express to serve static files from (CSS and JS)
 */
app.use('/assets', express.static('assets'));

/*
 * Create engine view and extension
 */
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        ifeq: function(a, b, options) {
            if (a === b) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

/*
 * Setup route methods so that the database connects on each requrest.
 */
app.use((req, res, next) => {
    let conn = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.dbname
    });
    conn.connect((err) => {
        if (err) return next(err);
        req.db = conn;
        next();
    });
});

/*
 * Add route paths
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(networkRouter);
app.use(seriesRouter);
app.use(reviewsRouter);
app.use(writersRouter);
app.use(actorsRouter);

/*
 * Setup handler for 404 requests
 */
app.use('*', (req, res) => {
    res.status(404);
    res.render('404', createViewContext());
});

/*
 * Error handling
 */
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    res.status(500);
    res.render('500', createViewContext());
});

/*
 * Begin server
 */
app.listen(PORT, () => {
    console.log('Final Project - Server is listening on port ' + PORT);
});
