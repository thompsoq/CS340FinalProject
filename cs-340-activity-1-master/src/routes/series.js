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

module.exports = router;
