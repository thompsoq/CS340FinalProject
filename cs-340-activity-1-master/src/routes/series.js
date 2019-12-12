/*
 * A lot of this page uses parts from activity 1 as a guide. Begin Express middleware and route
 */
const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/*
 * Route to actors database table, query for series id, series title, the initial air date, contributing writers 
 * number of sesies, series end date, and network name, then create
 * view/render for series.hbl if there were no errors 
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


/*
 * Route to display the series search page
 */
router.get('/series/search', (req, res) => {
    res.render('series-search', createViewContext({ message: 'Search for a Series' }));
});

/*
 * Script behind quering the series average rating
 */
router.post('/series/search', (req, res, next) => {
    let context = createViewContext();
    req.db.query(
		`
		SELECT s.title, AVG(r.rating) as "AverageRating"
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
