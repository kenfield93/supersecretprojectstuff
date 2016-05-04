/**
 * Created by kyle on 5/3/16.
 */

/*
exports.shoppingCartLink = function(shoppingCart){
    if(!shoppingCart)
       return "<a href='/checkOut' >Check Out</a>";

    return "";
}
*/

exports.noLoggedInRedirect = function(isLoggedIn, res){
    if( ! isLoggedIn)
        res.render("permissionDenied");
}

exports.notOwner = function(isOwner, res){
    if(! isOwner)
        res.render("wrongPermission");
}

exports.clearProductPageSession = function(session){
    session.saveProducts = null;
    session.saveCategoryId = null;

}