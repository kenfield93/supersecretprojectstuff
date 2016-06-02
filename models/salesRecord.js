/**
 * Created by kyle on 5/2/16.
 */

var query = require("./database.js");

var salesTable = 'sales_records';
var productSoldTable = 'product_sold';
var ordersTable = 'orders';


/*
exports.createProductSold = function(price, quantity, productId, salesRecordId){
    var sql = "BEGIN; INSERT INTO " + productSoldTable + " (price, quantity, product, sales_record ) VALUES " +
            " ( '" + price + "', '" + quantity + "', '" + productId + "', '" + salesRecordId + "' ); COMMIT;"
    ;

    return query.query(sql, null, function(err, result){
       if(err) {
           return null;
       }
       return true;
    });
};


exports.createSalesRecord = function(userId, date){
  var sql = "BEGIN; INSERT INTO " + salesTable + " (date, buyer) VALUES " +
      " ( '" + date + "', '" + userId + "' ) " + " RETURNING id; COMMIT;"
  ;

  return query.query(sql, null, function(err, result){
        if(err) {
            return null;
        }

        return result.rows;
  });
};
*/

exports.getCategories = function(productIdList){

    var productFilter = " ";
    for( i = 0; i < productIdList.length; i++){
        if( i == productIdList.length-1 )
            productFilter += " p.id = " + productIdList[i] + " ";
        else
            productFilter += " p.id = " + productIdList[i] + " OR ";
    }

    var sql = " SELECT p.id, p.category FROM product_items p WHERE " + productFilter  + "  GROUP BY p.id, p.category ";
    console.log("sql = " + sql);
    return query.query(sql, null, function(err, result){
        if(err)
            return null;
        if( result.rowCount == 0 )
            return false;
        return result.rows;
    });
};

exports.startTransaction = function(){
    query.query("BEGIN;", null, function(){});
};

exports.endTransaction = function(){
  query.query("COMMIT;", null, function(){});
};
exports.createOrder = function(userId, productId, quantity, price){
    var sql = " INSERT INTO " + ordersTable + " (user_id, product_id, quantity, price) VALUES " +
            " ( '" + userId + "', '" + productId + "', '" + quantity + "', '" + price + "' );"
    ;

    return query.query(sql, null, function(err, result){
        if(err)
            return null;

        return  true;
    });

};



