const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/**
 * Route for listing the catalog of parts.
 * 
 * This serves as an example of joining tables to produce more complex queries. You do not need to modify anything
 * in this file.
 */
router.get('/Network', (req, res, next) => {
    req.db.query(
        `
        SELECT n.nID, n.nName, n.nAddress, n.nWebsite
        FROM Network n
        ORDER BY n.nID
        `,
        (err, results) => {
            if (err) return next(err);
            res.render(
                'network',
                createViewContext({
                    pageName: 'View Network',
                    rows: results
                })
            );
        }
    );
});

/**
 * Route for displaying the form used to add a new part supplier.
 */
router.get('/network/search', (req, res) => {
    res.render('network-search', createViewContext({ message: 'Search for Series' }));
});

/**
 * Logic for actually adding a new part supplier using data from a form submission.
 */
router.post('/network/search', (req, res, next) => {
    let context = createViewContext();

    // Make sure a supplier with the provided SID doesn't already exist
    req.db.query(
		`
		SELECT n.nName, s.title 
		FROM Network n, Series s
		WHERE n.nName = ? AND n.nID = s.nID
		`, [req.body.nName],
		(err, results) => {
			if (err) return next(err);
			res.render(
				'network-srch-res',
				createViewContext({
					pageName: 'View Network Search',
					rows: results
				})
			);
		}
	);
});

module.exports = router;
