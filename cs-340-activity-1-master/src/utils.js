/*
 * Most of this page was acquired from activity 1. This page generates contex for handlebars, 
 * along with locals for context views when the page is rendered.
 */
const config = require('./config');

module.exports = {
    createViewContext: obj =>
        Object.assign(
            {
                username: config.onid,
                menuitems: [
					/*
					 * Contains info about the current URL
					 */
					{ location: '/actors', page: 'View Actors'},
					{ location: '/actors/search', page: 'Search Episodes by Actor'},
					{ location: '/network', page: 'View Network'},
					{ location: '/network/search', page: 'Search Series by Network'},
					{ location: '/reviews', page: 'View Reviews'},
					{ location: '/reviews/add', page: 'Add Review' },
					{ location: '/reviews/search', page: 'Search Reviews by Series & Episode'},
					{ location: '/series', page: 'View Series'},
					{ location: '/series/search', page: 'Series Average Rating'},
					{ location: '/writers', page: 'View Writers'}
                ]
            },
            obj
        )
};
