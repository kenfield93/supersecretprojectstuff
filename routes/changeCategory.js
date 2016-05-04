/**
 * Created by kyle on 4/17/16.
 */
var categoryModel = require("../models/category");
var general  = require("../models/general");

exports.post = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);
    general.clearProductPageSession(req.session);

    if( req.body.deleteButton == undefined){
        console.log("asdf" + req.body.updateButton);
        req.session.categoryId = req.body.updateButton;
        res.render('Owner/editCategory', {userName: req.session.name, status: " edit Category"});
    }
    else{
        console.log("ghjk" + req.body.deleteButton);
        var dbPromise = deleteCategory(req.body.deleteButton);
        // if category has some promise

        dbPromise.then(function (outcome) {
                if( outcome == false)
                    res.render('Owner/createCategoryStatus', {userName: req.session.name, status: " Category is not empty. Deletion failed"} );
                else
                    res.render('Owner/createCategoryStatus', {userName: req.session.name,  status: " Category was successfuly deleted"});
            },function(outcome){
                res.render('Owner/createCategoryStatus', { userName: req.session.name, status: " Category failed to delete"});
            }

        );
    }
}


// returns undefined if category still has products
// otherwise returns promise for status of delete operation
function deleteCategory(categoryId){
   var hasNoProducts = categoryModel.hasNoProducts(categoryId);
   return hasNoProducts.then(
       function(outcome){
        return categoryModel.deleteCategory(categoryId);
       },
       function(outcome){
           return false;
       }
   );

}


