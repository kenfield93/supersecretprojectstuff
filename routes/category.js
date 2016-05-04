/**
 * Created by kyle on 4/17/16.
 */
var category = require("../models/category");
var general  = require("../models/general");

exports.get = function (req, res, next){
    general.noLoggedInRedirect( req.session.loggedIn, res);

    var products = category.hasSomeProducts();
    var status = category.getCategories();
    status.then(function(outcome){
        if(outcome){
            products.then(function(categoriesWithAtLeastOneProduct) {
                var categoryList = createList(outcome, req.session.userId , categoriesWithAtLeastOneProduct);

                res.render("Owner/category", {userName: req.session.name, categoryList: categoryList});
            }, function(err){
                var categoryList = createList(outcome, req.session.userId);

                res.render("Owner/category", {userName: req.session.name, categoryList: categoryList});
            });

        }
        // no categories, so just display the page w/o making a list of them
        else{
              res.render("Owner/category", {userName : req.session.name});
        }
    });

};

/* Returns html for update and delete buttons. These are only displayed for categories that the owner created
 * Input: id of the category we're making the button for
 * Output: html string for delete and update buttons for the specified categoy
 * Side effects: none
 * Note: this is only called for categories that the user created
 */
function getButtonHTML(categoryID, nonEmptyCats){

    for(j = 0; j < nonEmptyCats.length; j++){
        if( categoryID == nonEmptyCats[j].category) {
            return "<form action='updateCategory' method='post'>" +
                " <button type='submit' name = 'updateButton' value= '" + categoryID + "' >Update</button>";
        }
    }

    return "<form action='updateCategory' method='post'>" +
        "<button type='submit' name = 'deleteButton' value= '" + categoryID +"' >Delete</button>  <button type='submit' name = 'updateButton' value= '" + categoryID +"' >Update</button>";

}

/*
 * Input: categoryList = an array from the DB w/ all category info
 *        ownerID = the id of the current user
 * Output: a string representing the html of each category to be displayed. For categoriese the user created it
 *         displays the update and delete buttons
 * Side effects: none
 */
function createList(categoryList, ownerID, nonEmptyCats){

    var html = "<ul> ";
    for(i = 0; i < categoryList.length; i++){
        html += "<li> ";
            html += "<form action= 'changeCategory' method='post'>"
                html += "<textbox>";
                    html += categoryList[i].name;
                html += "</textbox> <br>";
                html += "<textarea rows='5', cols='50'>";
                    html += categoryList[i].description;
                html += "</textarea>";
                // creator is who ever created the category. ownerID is current owner who is viewing the page
                if(categoryList[i].creator == ownerID) {
                    html += "<br>" + getButtonHTML(categoryList[i].id, nonEmptyCats);
                }
             html += "</form>";
        html += " </li> <br>";


        html += "<br><br>";
    }
    html += " </ul>";
    return html;
}
