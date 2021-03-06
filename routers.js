/**
 * Created by panew on 14-12-5.
 */
var express = require('express');
var router = express.Router();
var index = require('./controllers/index');
var article = require('./controllers/article');
var admin = require('./controllers/admin');
var errors = require('./controllers/errors');
var auth = require('./common/auth');
var sm = require('./common/sitemap');


router.get('/page', index.page);
router.get('/', index.show);
router.get('/article/:id', article.show);
router.get('/tags/:name', index.tags);
router.get('/archive', index.archive);
router.get('/login', index.login);
router.post('/login', index.loginto);
router.get('/friendlinks', index.friendlinks);
router.get('/about', index.about);
router.get('/resume', index.resume);

router.get('/admin/react*', index.adminReact);

router.get('/admin/*', auth.userRequired, index.admin);
router.get('/sitemap.xml', sm.sitemap);

router.all('/api/*', auth.userRequired);
router.use('/api', require('./api/admin'));
router.use('/common', require('./common'));

router.get('/404', errors[404]);
router.get('/500', errors[500]);

module.exports = router;