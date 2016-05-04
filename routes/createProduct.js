/**
 * Created by kyle on 4/24/16.
 */

var productModel = require("../models/product");
var general = require("../models/general");

exports.post = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);


    var name = req.body.productName;
    name = name.trim();
    var sku = req.body.sku;
    var listPrice = req.body.listPrice;
    var categoryId = req.body.category;
    var userID = req.session.userId;

    var status = productModel.createProduct(categoryId, name, sku, listPrice);


    status.then( function(outcome){
            req.session.status = "Product created Successfully";
            res.redirect('products');
        }, function(outcome){
           req.session.status = "Product failed to be created";
           res.redirect('products');
        }
    );

};
