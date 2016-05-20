/**
 * Created by kyle on 4/24/16.
 */
var query = require("./database.js");
var productTable = "product_items";

exports.createProduct = function (cateogryId, productName, sku, price){

     var sql = "BEGIN; INSERT INTO " + productTable + " (category, name, sku, price) VALUES " +
             " ( '" + cateogryId + "', '" + productName + "', '" + sku + "', '" + price + "'); COMMIT; "
    ;

    var dbPromise = query.query(sql, null, function(err, result){
        if( err)
          return null;

        return true;
    });
    return dbPromise;
};

exports.getProductsByCategory = function(categoryId){

    var sql = "SELECT * " +
              "FROM " + productTable + " p " +
              "WHERE category= '" + categoryId + "' "
    ;
    if( categoryId < 0)
       sql = "SELECT * " + " FROM " + productTable + " p " ;

    var dbPromise = query.query(sql, null, function(err, result){
          if(err)
             return null;
          if( result.rowCount == 0 )
             return false;
          return result.rows;
    });
    return dbPromise;
};

exports.deleteProduct = function(productId){
    var sql = "BEGIN; DELETE FROM " + productTable +
            " AS p WHERE p.id = '" + productId + "'; COMMIT;"
    ;
    return query.query(sql, null, function(err, result){
          if(err){
              console.log("oh no boy, we fucked now");
              return null;
          }
          return true;
    });
};

exports.editProduct = function(productId, name, sku, price, category){

        var sql = "BEGIN; UPDATE " + productTable +
                " SET name = '" + name + "' , sku = '" + sku + "' , price = '" + price + "' , category ='" + category + "'" +
                " WHERE id='" + productId + "'; COMMIT;"
            ;

        var dbPromise = query.query(sql, null, function(err, result){
            if(err){
                return null;
            }
            return true;
        });

        return dbPromise;

};


exports.getProduct = function(productId){

   var sql = "SELECT p.name, p.price " +
           "FROM " + productTable + " p " +
           " WHERE p.id = '" + productId + "' "
    ;

    return query.query(sql, null, function(err, result){
        if( err)
           return null;
        if( result.rowCount == 0)
           return false;
        return result.rows;
    });
};

exports.searchForProduct = function(cateogryId, queryString){
    var catId = "";
    if( cateogryId && cateogryId >= 0)
       catId = " category = '" + cateogryId + "' AND ";
    var regExpression = "%" + queryString + "%";
    var sql = "SELECT * " +
            "FROM " + productTable + " p " +
            " WHERE " + catId +
            " p.name LIKE '" + regExpression + "'"
    ;

    var dbPromise = query.query(sql, null, function(err, result){
        if(err)
            return null;
        if( result.rowCount == 0)
            return false;
        return result.rows;
    });
    return dbPromise;
};

