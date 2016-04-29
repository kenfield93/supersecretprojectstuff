/**
 * Created by kyle on 4/17/16.
 */
var categoryModel = require("../models/category");

exports.post = function(req, res, next){

    console.log("juicer %j", req.body);


    if( req.body.deleteButton == undefined){
        req.session.categoryId = req.body.editButton;
        console.log("ds3 " + req.body.editButton);
        res.render('Owner/editCategory', {status: " edit Category"});
    }
    else{
        var dbPromise = deleteCategory(req.body.deleteButton);
        // if category has some promise

        dbPromise.then(function (outcome) {
                if( outcome == false)
                    res.render('Owner/createCategoryStatus', {status: " Category is not empty. Deletion failed"} );
                else
                    res.render('Owner/createCategoryStatus', { status: " Category was successfuly deleted"});
            },function(outcome){
                res.render('Owner/createCategoryStatus', { status: " Category failed to delete"});
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


