/**
 * Created by kyle on 4/17/16.
 */
    /* TODO deal w/ issues when sessions don't exist
      I think we can/should create a global function to do this for each time session data is used
      or make it so sessions are never deleted. Need to research express' sessions in depth more
     */
var categoryModel = require("../models/category");
var general = require("../models/general");

exports.post = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);
    general.clearProductPageSession(req.session);
    var userName = req.session.name;
   var name = req.body.categoryName;
    name = name.trim();
   var description = req.body.categoryDescription;
   var userID = req.session.userId;

    console.log("titty " + userName);
   var status = categoryModel.createCategory(name, description, userID);

   //TODO: call catch function or put second func for reject. Do this everywhere status.then is called
   status.then( function(outcome){
         if( outcome === true) {
            res.render('Owner/createCategoryStatus', {userName: userName, categoryName: name, status: " Category was successfuly created"});
         }
         else {
             console.log("nonope " + outcome);
            res.render('Owner/createCategoryStatus', {userName: userName, categoryName: name, status: " Category creation failed"});
         }
      }, function (outcome) {
            console.log("yesyeah " + outcome);
            res.render('Owner/createCategoryStatus', {userName: userName, categoryName: name, status: " Category creation failed"} );
       }
   );


};