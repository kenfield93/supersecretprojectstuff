/**
 * Created by kyle on 4/24/16.
 */
var categoryModel = require("../models/category");
var general = require("../models/general");

exports.post = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);

    var categoryId = req.session.categoryId,
        title = req.body.categoryName,
        description = req.body.categoryDescription;

   var status = categoryModel.updateCategory(categoryId, title, description);

   status.then(function(err, result)
            {
                res.render('Owner/createCategoryStatus', {userName: req.session.name, status: " Category was successfuly updated"});
            },function(err, result){
       // can use err to specify what the error was
                res.render('Owner/createCategoryStatus', {userName: req.session.name, status: " Category failed to update"});
            }

   );


}