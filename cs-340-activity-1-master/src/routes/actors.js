const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/**
 * Route for listing the catalog of parts.
 * 
 * This serves as an example of joining tables to produce more complex queries. You do not need to modify anything
 * in this file.
 */
router.get('/Actors', (req, res, next) => {
    req.db.query(
        `
        SELECT a.name, a.aID, a.address, a.phone_num
        FROM Actors a
        ORDER BY a.aID
        `,
        (err, results) => {
            if (err) return next(err);
            res.render(
                'actors',
                createViewContext({
                    pageName: 'View Actors',
                    rows: results
                })
            );
        }
    );
});

/**
 * Route for displaying the form used to add a new part supplier.
 */
router.get('/actors/search', (req, res) => {
    res.render('actors-search', createViewContext({ message: 'Search for an Actor' }));
});

/**
 * Logic for actually adding a new part supplier using data from a form submission.
 */
router.post('/actors/search', (req, res, next) => {
    let context = createViewContext();

    // Make sure a supplier with the provided SID doesn't already exist
    req.db.query(
		`
		SELECT a.name, s.title, e.ep_num
		FROM Actors a, Played_By p, Episodes e, Series s 
		WHERE a.name = ? AND a.aID = p.aID AND p.sID = e.sID AND p.ep_num = e.ep_num AND e.sID = s.sID
		`, [req.body.name],
		(err, results) => {
			if (err) return next(err);
			res.render(
				'actors-search-res',
				createViewContext({
					pageName: 'View Actors Search',
					rows: results
				})
			);
		}
	);
});

module.exports = router;
