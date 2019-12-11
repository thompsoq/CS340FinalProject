/*
 * A lot of this page uses parts from activity 1 as a guide. Begin Express middleware and route
 */
const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/*
 * Route to writers database table, query writers name and series title, then create
 * view/render for writers.hbl if there were no errors 
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
