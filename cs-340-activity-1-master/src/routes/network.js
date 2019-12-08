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

module.exports = router;
