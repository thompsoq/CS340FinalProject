/*
 * A lot of this page uses parts from activity 1 as a guide. Begin Express middleware and route
 */
const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/*
 * Route to reviews database table, query for everything, then create
 * view/render for reviews.hbl if there were no errors 
 */
router.get('/reviews', (req, res, next) => {
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

/*
 * Route to display the review add page
 */
router.get('/reviews/add', (req, res) => {
    res.render('reviews-add', createViewContext({ message: 'Add New Review' }));
});

/*
 * Script behind the addition of a review into the Reviews table and Rated_By table
 */
router.post('/reviews/add', (req, res, next) => {
    let context = createViewContext();

    req.db.query('SELECT * FROM Reviews WHERE rID = ?', [req.body.rID], (err, results) => {
        if (err) return next(err);
        if (results.length) {
            context.message = `Can't create review because rID ${req.body.rID} already exists`;
            res.render('reviews-add', context);
        } else {
			req.db.query('SELECT * FROM Episodes WHERE sID = ? AND ep_num = ?', [req.body.sID, req.body.ep_num], (err, results) => {
			if (err) return next(err);
			if (results.length) {
				req.db.query(
					'INSERT INTO Reviews (user_name, rating, `desc`, rID) VALUES (?,?,?,?)',
					[req.body.user_name, req.body.rating, req.body.desc, req.body.rID],
					err => {
						if (err) return next(err);
					}
				);
				req.db.query(
					'INSERT INTO Rated_By (rID, ep_num, sID) VALUES (?,?,?)',
					[req.body.rID, req.body.ep_num, req.body.sID],
					err => {
						if (err) return next(err);

						context.message = 'Review added successfully';
						res.render('reviews-add', context);
					}
				);
			} else {
				context.message = `Can't create review because sID ${req.body.sID} doesn't exist`;
				res.render('reviews-add', context);
			}
        	});
	}
    });
});

/*
 * Route to display the review search page
 */
router.get('/reviews/search', (req, res) => {
    res.render('reviews-search', createViewContext({ message: 'Search for a Review' }));
});

/*
 * Script behind the search for reviews based on series and episode
 */
router.post('/reviews/search', (req, res, next) => {
    let context = createViewContext();
    req.db.query(
		`
		SELECT s.title, e.ep_num, r.rID, r.rating, r.desc
		FROM Reviews r, Rated_By b, Episodes e, Series s
		WHERE s.title = ? 
		AND e.ep_num = ? 
		AND r.rID = b.rID 
		AND b.sID = e.sID 
		AND b.ep_num = e.ep_num 
		AND e.sID = s.sID
		`, [req.body.title, req.body.ep_num],
		(err, results) => {
			if (err) return next(err);
			res.render(
				'reviews-search-res',
				createViewContext({
					pageName: 'View Review Search',
					rows: results
				})
			);
		}
	);
});


module.exports = router;
