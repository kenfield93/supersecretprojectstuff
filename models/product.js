/**
 * Created by kyle on 4/24/16.
 */
var query = require("./database.js");
var productTable = "product_items";

exports.createProduct = function (cateogryId, productName, sku, price){

     var sql = "INSERT INTO " + productTable + " (category, name, sku, price) VALUES " +
             " ( '" + cateogryId + "', '" + productName + "', '" + sku + "', '" + price + "') "
    ;

    var dbPromise = query.query(sql, null, function(err, result){
        if( err)
          return null;

        return true;
    });
    return dbPromise;
}

exports.getProductsByCategory = function(categoryId){

    var sql = "SELECT * " +
              "FROM " + productTable + " p " +
              "WHERE category= '" + categoryId + "' "
    ;

    var dbPromise = query.query(sql, null, function(err, result){
          if(err)
             return null;
          if( result.rowCount == 0 )
             return false;
          return result.rows;
    });
    return dbPromise;
}