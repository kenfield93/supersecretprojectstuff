/**
 * Created by kyle on 4/30/16.
 */

var product = require("../models/product");
var general = require("../models/general");

exports.post = function(req, res, next){

    general.noLoggedInRedirect(req.session.loggedIn, res);
    req.session.redirectProduct = true;

    if( req.body.deleteButton == undefined){

        var name = req.body.name;
        var sku = req.body.sku;
        var price = req.body.price;
        var categoryId = req.body.category;


       var editPromise = editProduct(req.body.editButton, name, sku, price, categoryId);
        editPromise.then(function(success){
            req.session.status = " Product Was Updated Successfully";
            res.redirect('searchProduct');
        }, function(err){
            req.session.status = " Product Failed to Update";
            res.redirect('searchProduct');
        });
    }
    else {
        var deletePromise = deleteProduct( req.body.deleteButton);
        deletePromise.then(function(success){
            req.session.status = " Product Deleted Successfully";
            res.redirect('searchProduct');
        }, function(err){
            req.session.status = " Product Failed to Delete";
            res.redirect('searchProduct');
        });

    }
};

function deleteProduct(productId){

   return product.deleteProduct(productId);

}

function editProduct(productId, name, sku, price, categoryId){
  return product.editProduct(productId, name, sku, price, categoryId);
}