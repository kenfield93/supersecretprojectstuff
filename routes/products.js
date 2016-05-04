/**
 * Created by kyle on 4/24/16.
 */
var category = require("../models/category");
var product = require("../models/product");
var general = require("../models/general");

exports.get = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);
    general.notOwner( req.session.isOwner, res);

    var productCreationStatus = req.session.status;
    req.session.status = null;

    var userName = req.session.name;
    var productsDisplay;
    var categoryId = req.query.categoryId;
    req.session.categoryId = categoryId;
    req.session.storedCategoryId = categoryId;
    var searchResults = req.session.searchedProducts;
    req.session.searchedProducts = null;

    if( searchResults ){
          renderProductPage(res, productCreationStatus, searchResults, userName);
    }
    else if( categoryId ){
        req.session.searchInput = null;
        productsPromise = getProductsByCategory(categoryId);

        productsPromise.then(function(prodDisplay) {
            productsDisplay = prodDisplay;

            renderProductPage(res, productCreationStatus, productsDisplay, userName );

        }, function(outcome){

        });
    }

    else {
        console.log("ooh la la");
        renderProductPage(res, productCreationStatus, productsDisplay, userName);

    }
};


function renderProductPage(res, productCreationStatus, productsDisplay, userName){
    var status = category.getCategories();



    status.then(function (outcome) {
        if (outcome) {
            var categoryDropDown = createDropDown(outcome);
            var categoryList = createCategoryLinks(outcome);
            res.render("Owner/products", { userName: userName,
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
    html += "<li> <a href='/products?categoryId=" + encodeURIComponent("-1") + "'> All Products</a> </li>" ;
    for(i = 0; i < categories.length; i++){
        // think theres a library for dis to do the encoding
        html += " <li> ";
        // if just using id then function isn't needed
        var dirtyURL = "/products?categoryId=" + encodeURIComponent("" + categories[i].id);
        var categoryName = categories[i].name;
        html += "<a href='" + dirtyURL+ "' > " + categoryName + " </a>";
        html += " </li> ";
    }

    return html += " </ul>";
}

function getProductsByCategory(categoryId){
        var dbPromise = product.getProductsByCategory(categoryId);
    var productList;

    return dbPromise.then(function(outcome){
          productList = createURL(outcome);
          return productList;
    }, function(outcome){
            console.log("oh no");
            return outcome;
        }
    );

}

/*
var createURL = function(result){
    var html ="<ul> ";

    for(i = 0; i < result.length; i++){
        html += " <li> ";
        //TODO:
        var dirtyURL = "products?productId=" + encodeURIComponent(result[i].id);
        var productName = result[i].name;
        html += "<a href='" + dirtyURL + "' > " + productName + " </a>";
        html += " </li> ";
    }
    html += " </ul>";
    return html;
};
*/

var createURL = function(result){
    var html = "<ul>";
    // make labels of what each column is
    //html += "<form> <textarea value =''> <input placeholder='' </form>>"

    var dropDown;

    var status = category.getCategories();


    return status.then(function (outcome) {
        if (outcome) {
            var categoryDropDown = createDropDown(outcome);
            var tab = "&nbsp".repeat(25);
            // no categories, so just display the page w/o making a list of them
            if( result.length > 0)
               html += "<b> Name " + tab + " SKU " + tab + " Price " + " </b>"
            for (i = 0; i < result.length; i++) {
                html += "<form action = 'changeProduct' method='post' >";
                html += "<input type = 'text' name='name' placeholder='" + result[i].name + "'>";
                html += "<input type = 'text' name='sku' placeholder='" + result[i].sku + "'>";
                html += "<input type = 'number' name='price' placeholder='" + result[i].price + "'>";
                html += categoryDropDown;
                html += "<button type='submit' name='editButton' value='" + result[i].id + "'>Edit</button>";
                html += "<button type='submit' name='deleteButton' value='" + result[i].id + "'>Delete</button>";
                html += "</form>";
            }
            return html += " </ul>";
        }
        else {
              return html += "</ul>"
            }
        }, function(err){
           return html += "</ul>";

    });

};

exports.dbToProductLinks = createURL;