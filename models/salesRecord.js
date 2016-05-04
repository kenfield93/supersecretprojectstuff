/**
 * Created by kyle on 5/2/16.
 */

var query = require("./database.js");

var salesTable = 'sales_records';
var productSoldTable = 'product_sold';



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



