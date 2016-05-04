/**
 * Created by kyle on 5/2/16.
 */
var products = require("../models/product");
var general = require("../models/general");

exports.get = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);
    general.clearProductPageSession(req.session);
    if( req.query.quantity){

        var productId = req.query.productId;
        var quantity = req.query.quantity;
        var price = req.query.price;
        var name = req.query.name;

        if(! req.session.shoppingCart)
           req.session.shoppingCart = [];

        req.session.shoppingCart.push({productId: productId, name : name,  quantity : quantity, price : price});
        res.redirect("checkOut");

    }

    else{

        if(! req.query.productId){
            var shoppingCarDisplay = getShoppingCart(req.session.shoppingCart);
            res.render('Customer/productOrder', {userName: req.session.name, shoppingCart: shoppingCarDisplay, product: "No Product Picked",});
        }

        var productId = req.query.productId;
        var productInfoPromise = products.getProduct(productId);
    //    var cartProductIds = req.session.shoppingCart.map(function(obj){ return obj.productId});


        productInfoPromise.then( function(result) {

                var productDisplay = "<p>" + result[0].name + "\t\t  $" + result[0].price + " </p>";
                var shoppingCarDisplay = getShoppingCart(req.session.shoppingCart);
               res.render('Customer/productOrder', {userName: req.session.name, shoppingCart: shoppingCarDisplay, product: productDisplay,
                                                    name: result[0].name + ": ", productId: productId, price: result[0].price });
            }
        );
    }

};

// shopping car session should have product name, product id, quantity
function getShoppingCart(shoppingCartSession){
    var tab = "&nbsp".repeat(5);
    var totalPrice = 0;
    var html = "<ul>";
    if(! shoppingCartSession || shoppingCartSession.length <= 0)
        html += "<li> No Items in Cart </li>";
    else {

        for (i = 0; i < shoppingCartSession.length; i++) {
            html += "<li>";
            html += "name: " + tab + shoppingCartSession[i].name;
            html += tab + "qunatity:" + tab + shoppingCartSession[i].quantity;
            html += tab + "individual prcie:" + tab + shoppingCartSession[i].price;
            totalPrice += shoppingCartSession[i].quantity * shoppingCartSession[i].price;
            html += tab + "total price:"+ tab + (shoppingCartSession[i].quantity * shoppingCartSession[i].price);
            html += "</li>";
        }
        html +="<br> <p>Total Cost of Shopping cart: " + tab + totalPrice + "</p>";
    }
    html += "</ul>";
    return html;
}

exports.displayShoppingCart = getShoppingCart;