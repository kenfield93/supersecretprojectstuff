/**
 * Created by kyle on 4/24/16.
 */
var category = require("../models/category.js");
var product = require("../models/product.js");

exports.get = function(req, res, next){

    var productCreationStatus = req.session.status;
    req.session.status = null;

    var productsDisplay;
    var categoryId = req.query.categoryId;


    if( categoryId ){
        console.log("called ya see \n");
        productsPromise = getProductsByCategory(categoryId);
        productsDisplay = productsPromise;

        productsPromise.then(function(prodDisplay) {
            productsDisplay = prodDisplay;
            renderProductPage(res, productCreationStatus, productsDisplay);

        });
    }

    else {
        console.log("ooh la la");
        renderProductPage(res, productCreationStatus, productsDisplay);

    }
}


function renderProductPage(res, productCreationStatus, productsDisplay){
    var status = category.getCategories();

    status.then(function (outcome) {
        if (outcome) {
            var categoryDropDown = createDropDown(outcome);
            var categoryList = createCategoryLinks(outcome);
            res.render("Owner/products", {
                categoryDropDown: categoryDropDown, status: productCreationStatus,
                categoryList: categoryList, productsDisplay: productsDisplay
            });
        }
        // no categories, so just display the page w/o making a list of them
        else {
            res.render("Owner/products", {categoryDropDown: "suck a dick", status: productCreationStatus});
        }
    });

}

/* categories: an array of json objects representing each rows' attributes(collumns)  *
/
 */
function createDropDown(categories){
   var html = "<div> ";
    html += " <select name = category> ";
    for( i = 0; i < categories.length; i++){
        html += " <option value='" + categories[i].id + "'>" + categories[i].name + "</option> " ;

    }
    html += " </select> </div>";

    return html;
}

function createCategoryLinks(categories, baseURL){
    var html = "<ul>";
    for(i = 0; i < categories.length; i++){
        // think theres a library for dis to do the encoding
        html += " <li> "
        // if just using id then function isn't needed
        var dirtyURL = "/products/?categoryId=" + encodeURIComponent("" + categories[i].id);
        console.log("dirty url" + dirtyURL);
        var categoryName = categories[i].name;
        html += "<a href='" + dirtyURL+ "' > " + categoryName + " </a>";
        html += " </li> ";
    }

    return html += " </ul>";
}

function getProductsByCategory(categoryId){
    var dbPromise = product.getProductsByCategory(categoryId);
    var products = [];
    var productList;

    var createURL = function(result){
        var html ="<ul> ";

        for(i = 0; i < result.length; i++){
            html += " <li> ";
            //TODO:
            var dirtyURL = "products/?productId=" + encodeURIComponent(result[i].id);
            var productName = result[i].name;
            html += "<a href='" + dirtyURL + "' > " + productName + " </a>";
            html += " </li> ";
        }
        html += " </ul>";
        productList =  html;
        return productList;
    }

    return dbPromise.then(function(outcome){
          return createURL(outcome);
    }, function(outcome){
            console.log("oh no");
            return outcome;
        }
    );

}