/**
 * Created by kyle on 5/2/16.
 */

var salesRecord = require("../models/salesRecord.js");
var productOrder = require("./productOrder.js");
var general = require("../models/general");

exports.get = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);
    //general.clearProductPageSession(req.session);

    res.render('Customer/checkOut', { userName: req.session.name, shoppingCart : productOrder.displayShoppingCart(req.session.shoppingCart) });

};

exports.post = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);

    var shoppingCart = req.session.shoppingCart;
    if( !shoppingCart || shoppingCart.length < 1) {
        req.session.shoppingCart = null;
        res.render('Customer/checkOutStatus', {userName: req.session.name, status : "Purchase Failed. No items were found in your shopping cart"});
    }

    var creditInfo = req.body.cardInfo;
    //create sales record w/ date and userId and get the new id
    var dateObj = new Date();
    var date = dateObj.getFullYear() + "/" + (dateObj.getMonth() + 1) +  "/" + dateObj.getDate();
    var userId = req.session.userId;
    var shoppingCart = req.session.shoppingCart;

    var salesPromise = salesRecord.createSalesRecord(userId, date);
    salesPromise.then(function(salesRecordId){
        for(i = 0; i < shoppingCart.length; i++ ) {
            salesRecord.createProductSold(shoppingCart[i].price, shoppingCart[i].quantity,
                                            shoppingCart[i].productId, salesRecordId[0].id);

        }
    }, function(err){
            req.session.shoppingCart = null;
            res.render('Customer/checkOutStatus', {userName: req.session.name, status : "Purchase Failed!"});
    }

    );

    req.session.shoppingCart = null;
    res.render('Customer/checkOutStatus', {userName: req.session.name, status : "Purchase Successful!"});
}

function createProductList(productList){
    var html = "<ul> ";

    if(! productList)
       html += "<li> No Items in Cart </li>";

    for(i = 0; i < productList.length; i++){

        html += "<li> " + productList[i] + " </li>";
    }
    return html + "</ul>";

}