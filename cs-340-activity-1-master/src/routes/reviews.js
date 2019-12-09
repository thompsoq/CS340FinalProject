const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/**
 * Route for listing part suppliers.
 */
router.get('/reviews', (req, res, next) => {
    // TODO: implement the selection query
	req.db.query('SELECT * FROM Reviews', (err, results) => {
		if (err) return next(err);
		res.render(
			'reviews',
			createViewContext({
				pageName: 'List Reviews',
				rows: results
			})
		);
	});
});

/**
 * Route for displaying the form used to add a new part supplier.
 */
router.get('/reviews/add', (req, res) => {
    res.render('reviews-add', createViewContext({ message: 'Add New Review' }));
});

/**
 * Logic for actually adding a new part supplier using data from a form submission.
 */
router.post('/reviews/add', (req, res, next) => {
    let context = createViewContext();

    // Make sure a supplier with the provided SID doesn't already exist
    req.db.query('SELECT * FROM Reviews WHERE rID = ?', [req.body.rID], (err, results) => {
        if (err) return next(err);
        if (results.length) {
            // Already exists
            context.message = `Can't create parts with RID ${req.body.rID} because it already exists`;
            res.render('reviews-add', context);
        } else {
            // Doesn't exist, create it
            req.db.query(
                'INSERT INTO Reviews (user_name, rating, `desc`, rID) VALUES (?,?,?,?)',
                [req.body.user_name, req.body.rating, req.body.desc, req.body.rID],
                err => {
                    if (err) return next(err);

                    context.message = 'Review added successfully';
                    res.render('reviews-add', context);
                }
            );
        }
    });
});

module.exports = router;
