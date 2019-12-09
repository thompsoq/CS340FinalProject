const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/**
 * Route for listing the catalog of parts.
 * 
 * This serves as an example of joining tables to produce more complex queries. You do not need to modify anything
 * in this file.
 */
router.get('/Writers', (req, res, next) => {
    req.db.query(
        `
        SELECT w.writers, s.title
        FROM Series_Writers w, Series s
		WHERE w.sID = s.sID
        ORDER BY w.writers
        `,
        (err, results) => {
            if (err) return next(err);
            res.render(
                'writers',
                createViewContext({
                    pageName: 'View Writers',
                    rows: results
                })
            );
        }
    );
});

module.exports = router;
