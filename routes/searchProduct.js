/**
 * Created by kyle on 4/29/16.
 */
var product = require("../models/product");
var productController = require("./products");
var productBrowseController = require("./productBrowsing");
var general = require("../models/general");
exports.get = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);


    var queryString = req.query.searchInput;
    if(req.session.redirectProduct) {
        req.session.redirectProduct = false;
        queryString = req.session.searchInput;
        if(! queryString ) {
            if( req.session.isOwner ){
                if( req.query.searchProductsBrowsing != undefined)
                    res.redirect("/productBrowsing?categoryId=" + req.session.categoryId);
                else
                    res.redirect("/products?categoryId=" + req.session.categoryId);
            }
            else
                res.redirect("/productBrowsing?categoryId=" + req.session.categoryId);
        }
    }
    req.session.searchInput = queryString;
    //TODO if i have time just send the catId via as a var in the url ex searchProduct?catId=<>
    var categoryId = req.session.categoryId; // either add this to session in products.js or use hidden url
    // i'm thinking, pass back the search results in sessions
    var searchPromise = product.searchForProduct(categoryId, queryString);
    searchPromise.then(function(outcome){
        if( req.session.isOwner ){
            if( req.query.searchProductsBrowsing != undefined)
                var searchedProductsPromise = productBrowseController.dbToProductLinks(outcome);
            else
                var searchedProductsPromise = productController.dbToProductLinks(outcome);
        }
        else
           var searchedProductsPromise = productBrowseController.dbToProductLinks(outcome);
        searchedProductsPromise.then(function(outcome){
              req.session.searchedProducts = outcome;
              req.session.saveProducts = outcome;
                 if( req.session.isOwner ){
                     console.log("kill me plzz " + req.query.searchedProductsBrowsing);
                     if( req.query.searchProductsBrowsing != undefined)
                        res.redirect('productBrowsing');
                     else {
                         console.log("shit face");
                         res.redirect('products');
                     }
                }
                else
                  res.redirect('productBrowsing');
            }
            ,function(outcome){

                req.session.searchedProducts = "<p> Error in searchProduct </p>";
                if( req.session.isOwner ){
                    if( req.query.searchProductsBrowsing != undefined)
                        res.redirect('productsBrowsing');
                    else
                        res.redirect('products');
                }
                else
                    res.redirect('productBrowsing');
            }
        );

    }, function(outcome){
        req.session.searchedProducts = "<p> No Matching Products Found </p>";
        if( req.session.isOwner ){
            if( req.query.searchProductsBrowsing != undefined)
                res.redirect('productsBrowsing');
            else
                res.redirect('products');
        }
        else
            res.redirect('productBrowsing');
    });



};

