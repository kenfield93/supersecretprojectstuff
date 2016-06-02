/**
 * Created by kyle on 5/2/16.
 */

var salesRecord = require("../models/salesRecord.js");
var productOrder = require("./productOrder.js");
var general = require("../models/general");
var salesLog = require("../models/salesLog.js");

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

 //   salesRecord.startTransaction();
    var salesPromise;
    for(i = 0; i < shoppingCart.length; i++ ) {
        console.log("item price = " + shoppingCart[i].price);


        salesPromise = salesRecord.createOrder(userId, shoppingCart[i].productId, shoppingCart[i].quantity,
            shoppingCart[i].price);
        salesPromise.catch(function (err) {
            req.session.shoppingCart = null;
            res.render('Customer/checkOutStatus', {userName: req.session.name, status: "Purchase Failed!"});
        });
    }
//    salesRecord.endTransaction();

  //  var productrow = [{pid: 2, total: 19, category: 1 }];
  //  var staterow = [{state: 'CA', total: 69, category: 2}];
    // add to sales and product log

    var stateTotal = {};
    var productTotal = {};
    var productList= [] ;
    var productDict = [];

    for(i = 0; i < shoppingCart.length; i++){
        if(productDict[shoppingCart[i].productId] != 69) {
            productList.push(shoppingCart[i].productId);
            productDict[shoppingCart[i].productId] = 69;
        }

    }


    console.log(" ppo %j", productList);
    var getCategoryPromise = salesRecord.getCategories(productList);
    getCategoryPromise.then(function(outcome){
        console.log('see me %j', outcome);
        for(i = 0; i < shoppingCart.length; i++){
            console.log("i = " + i);
            for( j = 0; j < outcome.length; j++) {
                console.log("j = " + j);
                if(outcome[j].id == shoppingCart[i].productId) {
                    if( stateTotal['' + outcome[j].category] == null)
                        stateTotal['' + outcome[j].category] = 0;

                    stateTotal['' + outcome[j].category] += shoppingCart[i].quantity * shoppingCart[i].price;

                }
                console.log('kill me');
            }
            console.log("pretty plz");
            if( productTotal['' + shoppingCart[i].productId] == null)
                productTotal['' + shoppingCart[i].productId] = 0;
            console.log("pretty asdfa");
            productTotal['' + shoppingCart[i].productId] += shoppingCart[i].quantity * shoppingCart[i].price;
        console.log("pretty pz");
            if( stateTotal['-1'] == null)
                stateTotal['-1'] = 0;
            stateTotal['-1'] += shoppingCart[i].quantity * shoppingCart[i].price;
            console.log("sdo");
         //   productTotal[shoppingCart[i].productId] += shoppingCart[i].quantity * shoppingCart[i].price;
        }
        console.log("wtf dude %j", outcome);
        console.log("stateTotal %j", stateTotal);
        console.log("productTotal %j", productTotal);
        var stateRows = [];
        for(i = 0; i < outcome.length; i++){
            stateRows.push({state: req.session.userState , total: stateTotal['' + outcome[i].category], category: outcome[i].category});
        }
        console.log("stateRows = %j", stateRows);
        salesLog.updateStateRow(stateRows);

        productDict = [];
        var productRows = [];
        for(i = 0; i < shoppingCart.length; i++){
            console.log("obeyse %j", outcome);
            if(productDict[shoppingCart[i].productId] != 70) {
                for(j = 0; j < outcome.length; j++) {
                    if(outcome[j].id == shoppingCart[i].productId) {
                        productRows.push({
                            pid: shoppingCart[i].productId,
                            total: productTotal[shoppingCart[i].productId],
                            category: outcome[j].category
                        });
                    }
                }
                productDict[shoppingCart[i].productId] = 70;
            }
        }
        salesLog.updateProductRow(productRows);

        console.log("stateRows = %j", stateRows );
        console.log("productRows = %j", productRows);
        req.session.shoppingCart = null;
    });




    res.render('Customer/checkOutStatus', {userName: req.session.name, status : "Purchase Successful!"});
};

function createProductList(productList){
    var html = "<ul> ";

    if(! productList)
       html += "<li> No Items in Cart </li>";

    for(i = 0; i < productList.length; i++){

        html += "<li> " + productList[i] + " </li>";
    }
    return html + "</ul>";

}