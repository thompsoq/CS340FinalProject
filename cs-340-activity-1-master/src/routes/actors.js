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

module.exports = router;
