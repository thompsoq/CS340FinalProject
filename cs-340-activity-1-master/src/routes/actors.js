/*
 * A lot of this page uses parts from activity 1 as a guide. Begin Express middleware and route
 */
const express = require('express');
const { createViewContext } = require('../utils');

const router = express.Router();

/*
 * Route to actors database table, quert for name, actor id, address and phone number, then create
 * view/render for actors.hbl if there were no errors 
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

/*
 * Route to display the actor search page
 */
router.get('/actors/search', (req, res) => {
    res.render('actors-search', createViewContext({ message: 'Search for an Actor' }));
});

/*
 * Script behind quering for which actors played in which series
 */
router.post('/actors/search', (req, res, next) => {
    let context = createViewContext();
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
