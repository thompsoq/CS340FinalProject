/*
 * A lot of this page uses parts from activity 1 as a guide. Begin Express middleware and route
 */
const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/*
 * Route to actors database table, query for network id, network name, network address, network website
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

/*
 * Route to display the network search page
 */
router.get('/network/search', (req, res) => {
    res.render('network-search', createViewContext({ message: 'Search for Series' }));
});

/*
 * Script behind quering for which series belongs to which network
 */
router.post('/network/search', (req, res, next) => {
    let context = createViewContext();
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
