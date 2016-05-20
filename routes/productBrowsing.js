/**
 * Created by kyle on 4/24/16.
 */
var category = require("../models/category");
var product = require("../models/product");
var general = require("../models/general");

exports.get = function(req, res, next){
    general.noLoggedInRedirect(req.session.loggedIn, res);

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
    else {
        req.session.searchInput = null;
        productsPromise = getProductsByCategory(categoryId);

        productsPromise.then(function(prodDisplay) {
            productsDisplay = prodDisplay;
            if( categoryId)
                renderProductPage(res, productCreationStatus, productsDisplay, userName );
            else { console.log("akls");
                renderProductPage(res, productCreationStatus, null, userName);
                console.log("lick me");
            }

        }, function(outcome){

        });
    }

};


function renderProductPage(res, productCreationStatus, productsDisplay, userName){
    var status = category.getCategories();

    status.then(function (outcome) {
        if (outcome) {
           // var categoryDropDown = createDropDown(outcome);
            var categoryList = createCategoryLinks(outcome);
            res.render("Customer/productBrowsing", { userName: userName,
                 status: productCreationStatus,
                categoryList: categoryList, productsDisplay: productsDisplay
            });
        }
        // no categories, so just display the page w/o making a list of them
        else {
            res.render("Customer/productBrowsing", {categoryDropDown: "suck a dick", status: productCreationStatus});
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
    html += "<li> <a href='/productBrowsing?categoryId=" + encodeURIComponent("-1") + "'> All Products</a> </li>" ;
    for(i = 0; i < categories.length; i++){
        // think theres a library for dis to do the encoding
        html += " <li> ";
        // if just using id then function isn't needed
        var dirtyURL = "/productBrowsing?categoryId=" + encodeURIComponent("" + categories[i].id);
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
            return outcome;
        }
    );

}

var createURL = function(result){
    var html = "<ul>";
    // make labels of what each column is
    //html += "<form> <textarea value =''> <input placeholder='' </form>>"

    var dropDown;

    var status = category.getCategories();


    return status.then(function (outcome) {
        if (outcome) {
            //var categoryDropDown = createDropDown(outcome);
            var tab = "&nbsp".repeat(25);
            // no categories, so just display the page w/o making a list of them
            if( result.length > 0)
                html += "<b> Name " + tab + " SKU " + tab + " Price " + " </b>"
            for (var j = 0; j < result.length; j++) {
                html += "<form action = 'changeProduct' method='post' >";
                html += "<textarea name='name'>" +  result[j].name + "</textarea>";
                html += "<textarea name='sku' >" +  result[j].sku + "</textarea>";
                html += "<textarea  name='price' >" +  result[j].price + "</textarea>";
                html +=  "<a href='productOrder?productId=" + encodeURIComponent(result[j].id)  + "' > Order " + result[j].name + " </a>";
                html += "</form>";
                html += "<br>";
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
