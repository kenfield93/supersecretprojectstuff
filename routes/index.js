/**
 * Created by kyle on 4/10/16.
 */
var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', 'config'));


var landing = require('./landing');
var signup  = require('./signup');
var signin  = require('./signin');
var home    = require('./home');

var category = require('./category');
var createCategory = require('./createCategory');
var changeCategory = require('./changeCategory');
var editCategory   = require('./editCategory');

var products = require('./products');
var createProduct = require('./createProduct');
var searchProduct = require('./searchProduct');
var changeProduct = require('./changeProduct');

var productBrowsing = require('./productBrowsing');
var productOrder = require('./productOrder');
var checkOut = require('./checkOut');

var analytics = require('./salesAnalytics');
var similarProducts = require('./similarProducts');

var cse141 = require('./141problem');
/* GET home page. */

router.get('/', landing.get );
router.post('/signin', signin.post);
router.get('/home', home.get);
router.post('/signup', signup.post);

router.get('/categories', category.get);
router.post('/createCategory', createCategory.post);
router.post('/changeCategory', changeCategory.post);
router.post('/editCategory', editCategory.post);

router.get('/products', products.get);
router.post('/createProduct', createProduct.post);

router.get('/searchProduct', searchProduct.get);
router.post('/changeProduct', changeProduct.post);
router.get('/productBrowsing', productBrowsing.get);

router.get('/productOrder', productOrder.get);
router.get('/checkOut', checkOut.get);
router.post('/checkOut', checkOut.post);

router.get('/salesAnalytics', analytics.get);
router.get('/similarProducts', similarProducts.get);
//router.get('products/?categoryId=(*)',landing.get );

router.get('/cse141', cse141.get);

module.exports = router;



