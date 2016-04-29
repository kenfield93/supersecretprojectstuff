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

var category = require('./category');
var createCategory = require('./createCategory');
var changeCategory = require('./changeCategory');
var editCategory   = require('./editCategory');

var products = require('./products');
var createProduct = require('./createProduct');

/* GET home page. */
router.get('/', landing.get );
router.post('/signin', signin.post);


router.post('/signup', signup.post);
router.get('/categories', category.get);

router.post('/createCategory', createCategory.post);
router.post('/changeCategory', changeCategory.post);
router.post('/editCategory', editCategory.post);

router.get('/products', products.get);
router.post('/createProduct', createProduct.post);

module.exports = router;



// IGNORE THIS. FROM 112 PROJECT, JUST HERE TO USE AS A REFERENCE
/*
module.exports = function (passport) {

  //Setup the routes
  router.get('/', landing.get);
  router.post('/', landing.post);

  router.get('/theming', isLoggedIn, theming.get);

  router.post('/login',passport.authenticate('local-login',{
    successRedirect : '/dashboard',
    failureRedirect : '/',
    failureFlash: true
  }));

  router.get('/formbuilder',isLoggedIn, formbuilder.get);
  router.post('/formbuilder', isLoggedIn, formbuilder.post);

  router.get('/accountSettings', isLoggedIn, accountSettings.get);
  router.post('/accountSettings', isLoggedIn, accountSettings.post);

  router.get('/businesssetting', isLoggedIn, businesssetting.get);
  router.post('/businesssetting', isLoggedIn,businesssetting.post);

  router.get('/uploadlogo', isLoggedIn, uploadLogo.get);
  router.post('/uploadlogo', isLoggedIn, uploadLogo.post);

  router.get('/register', register.get);
  // router.post('/register',passport.authenticate('local-signup',{
  //     successRedirect : '/dashboard', // redirect to the secure profile section
  //     failureRedirect : '/register' // redirect back to the signup page if there is an error
  // }));
  router.post('/register', register.post);

  router.get('/dashboard', isLoggedIn, dashboard.get);

  router.get('/addemployees',isLoggedIn, addEmployees.get);
  router.post('/addemployees',isLoggedIn, addEmployees.post);
  router.post('/addemployees/delete', isLoggedIn, addEmployees.delete); // html can only call GET or POST
  router.post('/addemployees/mod', isLoggedIn, modifyEmployees.post);
  router.post('/employeeregister/resend', isLoggedIn, employeeRegister.post); // resend registration email

  router.get('/addAppointment', isLoggedIn, addAppointment.get);

  router.get('/customizetheme', isLoggedIn, customizeTheme.get);

  router.get('/manageforms', isLoggedIn, manageForms.get);

  router.get('/employeeregister', employeeRegister.get);
  router.post('/employeeregister', passport.authenticate('local-signup-employee',{
    successRedirect : '/dashboard', // redirect to the secure profile section
    failureRedirect : '/register' // redirect back to the signup page if there is an error
  }));

  router.get('/viewform/:id', viewForm.get);

  router.get('/checkin', isLoggedIn, checkin.get);
  router.post('/checkin', isLoggedIn, checkin.post);

  router.get('/logout', logOutUser);

  function logOutUser(req, res) {
    req.logOut();
    res.redirect('/');
  }

  function isLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/');
  }

  return router;
};
*/