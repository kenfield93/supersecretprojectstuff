/**
 * Created by kyle on 5/22/16.
 */
var query = require("./database.js");


exports.getSimilarPage = function() {
    sql =
    " WITH tempsum AS " +
    " (SELECT o.product_id, SUM(o.quantity) " +
    " AS quantity, price " +
    " FROM users u, orders o " +
    " WHERE u.id = o.user_id " +
    " GROUP BY u.id, o.product_id, price ), " +

    " totals AS " +
    " (SELECT product_id, SUM((quantity * price) * (quantity * price)) " +
    " FROM tempsum " +
    " GROUP BY product_id ), " +

    " sums AS " +
    " (SELECT product_id, name, sum " +
    " FROM totals JOIN product_items " +
    " ON product_id = product_items.id), " +

   " pairs AS " +
    " (SELECT p1.user_id, p1.product_id " +
   " AS product1, (p1.quantity * p1.price) AS c1, p2.product_id " +
    " AS product2, (p2.quantity * p2.price) " +
    " AS c2 FROM orders AS p1, orders AS p2 " +
    " WHERE p1.user_id = p2.user_id " +
    " AND p1.product_id < p2.product_id), " +

    " finals AS" +
   " (SELECT" +
   " user_id, product1, s1.name" +
   " AS" +
   " name1, c1, s1.sum" +
   " AS" +
   " sum1, product2, s2.name" +
   " AS" +
   " name2, c2, s2.sum" +
   " AS" +
   " sum2" +
   " FROM" +
   " pairs, sums" +
   " s1, sums" +
   " s2" +
   " WHERE product1 = s1.product_id" +
   " AND  product2 = s2.product_id )" +

   " SELECT name1 AS Product_1, name2 AS Product_2," +
   " SUM(c1 * c2) / (SQRT(SUM(sum1) / COUNT(sum1)) * SQRT(SUM(sum2) / COUNT(sum2))) " +
    " AS cosine FROM finals " +
    " GROUP BY Product_1, Product_2 " +
    " ORDER BY cosine DESC " +
    " LIMIT 100 "
    ;

    return query.query(sql, null, function(err, result){
        if(err)
            return null;
        if( result.rowCount == 0 )
            return false;
        return result.rows;
    });
};