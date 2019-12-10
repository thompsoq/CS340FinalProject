const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/**
 * Route for listing the catalog of parts.
 * 
 * This serves as an example of joining tables to produce more complex queries. You do not need to modify anything
 * in this file.
 */
router.get('/Series', (req, res, next) => {
    req.db.query(
        `
        SELECT s.sID, s.title, s.init_air_date, s.writers, s.num_seasons, s.end_date, n.nName
        FROM Series s, Network n
		WHERE s.nID = n.nID
        ORDER BY s.sID
        `,
        (err, results) => {
            if (err) return next(err);
            res.render(
                'series',
                createViewContext({
                    pageName: 'View Series',
                    rows: results
                })
            );
        }
    );
});


/**
 * Route for displaying the form used to add a new part supplier.
 */
router.get('/series/search', (req, res) => {
    res.render('series-search', createViewContext({ message: 'Search for a Series' }));
});

/**
 * Logic for actually adding a new part supplier using data from a form submission.
 */
router.post('/series/search', (req, res, next) => {
    let context = createViewContext();

    // Make sure a supplier with the provided SID doesn't already exist
    req.db.query(
		`
		SELECT s.title, AVG(r.rating)
		FROM Series s, Rated_By b, Reviews r
		WHERE s.title = ? AND s.sID = b.sID AND b.rID = r.rID
		`, [req.body.title],
		(err, results) => {
			if (err) return next(err);
			res.render(
				'series-avrg-rat-res',
				createViewContext({
					pageName: 'View Series Avg Rating',
					rows: results
				})
			);
		}
	);
});

module.exports = router;
