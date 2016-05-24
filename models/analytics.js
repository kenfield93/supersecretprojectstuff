/**
 * Created by kyle on 5/20/16.
 */

var query = require("./database.js");

 exports.getColumns = function ( categoryId, orderBy, productOffset){
     var categoryStmt = "";
     var categoryTopK = "";
     var customerSelection = "";

     if( categoryId >= 0){
         categoryStmt = " WHERE p.category = " + categoryId;
         categoryTopK = " JOIN product_items p ON o.product_id = p.id"
     }

     var sql = "";
     if( orderBy == "alphabetic") {

         sql += "WITH topProducts AS " +
             "(SELECT p.id, p.name " +
             " FROM product_items p " + categoryStmt +
             " GROUP BY p.id, p.name " +
             " ORDER BY p.name " +
             " LIMIT 20 OFFSET " + productOffset + " ) " +

             " SELECT topProducts.name , coalesce(SUM(o.price * o.quantity), 0) AS total " +
             " FROM topProducts LEFT JOIN orders o " +
             " ON topProducts.id = o.product_id " +
             " GROUP BY topProducts.name" +
             " ORDER BY topProducts.name; "
         ;
     }
     else{
         sql += " WITH categoryProducts AS " +
             " (SELECT p.id, p.name FROM product_items p " + categoryStmt + " )" +

             " SELECT x.name, x.total  " +
             "FROM (SELECT p.name, coalesce(SUM(o.price * o.quantity), 0) AS total " +
                    " FROM categoryProducts p LEFT JOIN orders o ON p.id = o.product_id " +
                    " GROUP BY p.name ) x " +
             " ORDER BY x.total DESC LIMIT 20 OFFSET " + productOffset
         ;

     }

     return query.query(sql, null, function(err, result){
         if(err)
             return null;
         if( result.rowCount == 0 )
             return false;
         return result.rows;
     });
 };


exports.getCells = function(categoryId, orderBy, customerFilter, productOffset, customerOffset){
    var categoryStmt = "";
    var categoryTopK = "";
    var customerSelection = "";

    if( categoryId >= 0){
        categoryStmt = " WHERE p.category = " + categoryId;
        categoryTopK = " JOIN product_items p ON o.product_id = p.id"
    }
    if( customerFilter == "customer"){
        customerSelection = "name ";
    }
    else{ // filter by state
        customerSelection = "state";
    }

    var sql = "";
    if( orderBy == "alphabetic") {
     sql = "DROP TABLE IF EXISTS topCustomers ; " +
          "CREATE TEMP TABLE  topCustomers AS " +
        " SELECT u.id, u." + customerSelection +
        " FROM users u " +
        " ORDER BY u." + customerSelection +
        " LIMIT 10 OFFSET " + customerOffset + " ;  " +
            //

         " WITH topProducts AS " +
         "(SELECT p.id, p.name " +
         " FROM product_items p " + categoryStmt +
         " GROUP BY p.id, p.name " +
         " ORDER BY p.name " +
         " LIMIT 20 OFFSET " + productOffset + " ) " +
            // need to filter out products

             //
         ", categoryProducts AS " +
         " (SELECT p.id FROM product_items p " + categoryStmt + " )" +

         ", filteredProducts AS " +
         " (SELECT o.price, o.quantity, o.user_id" +
         " FROM categoryProducts, orders o" +
         " WHERE categoryProducts.id = o.product_id " +
         " )";


         if( customerFilter == "customer") {
             sql += " SELECT rows.name, rows.total, coalesce(SUM(f.price * f.quantity), 0 ) as aggregate " +
             " FROM  (SELECT rows.userName as name, rows.productName, rows.user, coalesce(SUM(o.price * o.quantity), 0) as total " + //rows.userName AS name, coalesce(SUM(o.price * o.quantity),0)" +
             " FROM (SELECT u.id as user, p.id as product, u.name as username, p.name as productname FROM topCustomers u , topProducts p " +
             " ORDER BY u.name, u.id, p.name, p.id ) rows " +
             " LEFT JOIN orders o ON o.product_id = rows.product AND o.user_id = rows.user " +
             " GROUP BY rows.userName, rows.user, rows.productName ORDER BY rows.userName, rows.productName ) rows LEFT JOIN filteredProducts f ON rows.user = f.user_id GROUP BY rows.total, rows.user, rows.Name, rows.productName ORDER BY rows.name, rows.productName "

             ;
         }
        else{

             sql +=  " SELECT rows.state  , x.total AS aggregate, coalesce(SUM(rows.total), 0) as total  " +
                 " FROM (SELECT  rows.state, rows.productName, rows.user, coalesce( SUM(o.price * o.quantity),0 ) as total"  +

                 " FROM  (SELECT u.id as user, p.id as product, u.state , p.name as productName FROM topCustomers u , topProducts p " +
                 " ORDER BY u.state, u.id, p.name, p.id) rows " +
                 " LEFT JOIN orders o ON o.product_id = rows.product AND o.user_id = rows.user " +
                 " GROUP BY rows.state, rows.user, rows.productName ORDER BY rows.state, rows.productName) rows " +
                   //  "  )"
                     " JOIN   (SELECT state, coalesce(SUM(x.price * x.quantity),0) AS total FROM (SELECT o.user_id, o.price, o.quantity FROM categoryProducts p JOIN orders o ON p.id = o.product_id ) x RIGHT JOIN topCustomers u ON u.id = x.user_id  GROUP BY u.state)  x" +
                 " ON x.state = rows.state GROUP BY rows.state, rows.productName, x.total ORDER BY rows.state, rows.productName "

        ;
         }
    }
    else{
        sql = " WITH categoryProducts AS " +
                 " (SELECT p.id, p.name FROM product_items p " + categoryStmt + " )" +

         "  , topCustomers AS " +
            " (SELECT x.total, x.id, x." + customerSelection +
            " FROM ( SELECT u.id, u." + customerSelection + ", coalesce(SUM(o.price * o.quantity), 0) AS total " +
                " FROM users u LEFT JOIN ( SELECT o.* FROM categoryProducts p JOIN orders o ON p.id = o.product_id  ) o ON u.id = o.user_id " +
                " GROUP BY u.id, u." + customerSelection + " ) x " +
            " ORDER BY x.total DESC  LIMIT 10 OFFSET " + customerOffset + " ) " +


            ", filteredProducts AS " +
            " (SELECT o.price, o.quantity, o.user_id" +
            " FROM categoryProducts c, orders o" +
            " WHERE c.id = o.product_id " +
            " )  " +

            " , topProducts AS " +
            "( SELECT x.name, x.total, x.id  " +
            "FROM (SELECT p.name, p.id, coalesce(SUM(o.price * o.quantity), 0) AS total " +
            " FROM categoryProducts p LEFT JOIN orders o ON p.id = o.product_id " +
            " GROUP BY p.name, p.id) x " +
            " ORDER BY x.total  DESC LIMIT 20 OFFSET " + productOffset + " )  "

        ;

        if( customerFilter == "customer") {

            sql += " SELECT  rows.name, rows.total, coalesce(SUM(f.price * f.quantity), 0 ) as aggregate" +
                " FROM (SELECT rows.rowOrdering, rows.userName as name, rows.productName, rows.user, coalesce(SUM(o.price * o.quantity),0) as total " +
                     " FROM  ( SELECT c.name AS userName , p.name AS productName , p.total AS rowOrdering, p.id AS product, c.id AS user  " +
                         " FROM topProducts p , topCustomers c  GROUP BY c.name, p.total, p.name, p.id, c.id ORDER BY c.name, p.total DESC ) rows " +

                    " LEFT JOIN orders o ON o.product_id = rows.product AND o.user_id = rows.user " +
                    " GROUP BY rows.userName, rows.rowOrdering, rows.productName, rows.user ORDER BY rows.userName, rows.rowOrdering DESC ) rows " +
                " LEFT JOIN filteredProducts f ON rows.user = f.user_id GROUP BY rows.total, rows.user, rows.Name, rows.productName, rows.rowOrdering  ORDER BY coalesce(SUM(f.price * f.quantity), 0 ) DESC, rows.name, rows.rowOrdering DESC  "
            ;

        }
        else{
          //  sql += "SELECT state, coalesce(SUM(x.price * x.quantity), 0) as total FROM ( SELECT o.user_id, o.price, o.quantity FROM categoryProducts p LEFT JOIN orders o ON p.id = o.product_id ) x RIGHT JOIN topCustomers u ON u.id = x.user_id GROUP BY u.state "

            sql +=
                "SELECT   rows.state , x.total AS aggregate, coalesce(SUM(rows.total), 0) as total " +
                    //   "FROM (SELECT rows.rowOrdering, rows.state, rows.productName, rows.user, coalesce( SUM(rows.total), 0 ) as total " +
                " FROM (SELECT rows.rowOrdering, rows.state, rows.productName, rows.user, coalesce( SUM(o.price * o.quantity), 0 ) as total " +
                " FROM ( SELECT p.total AS rowOrdering, u.id as user, p.id as product, u.state , p.name as productName " +
                " FROM topCustomers u , topProducts p " +
                " ORDER BY u.id, p.total DESC, u.state, p.name, p.id ) rows " +
                " LEFT JOIN orders o ON o.product_id = rows.product AND o.user_id = rows.user " +
                " GROUP BY rows.user, rows.rowOrdering, rows.state, rows.productName ORDER BY rows.user, rows.rowOrdering DESC ) rows " +
                    //   " GROUP BY rows.state, rows.rowOrdering, rows.productName, rows.user ORDER BY rows.state, rows.rowOrdering DESC ) rows "+
                " JOIN ( SELECT state, coalesce(SUM(x.price * x.quantity), 0) as total FROM ( SELECT o.user_id, o.price, o.quantity FROM categoryProducts p LEFT JOIN orders o ON p.id = o.product_id ) x RIGHT JOIN topCustomers u ON u.id = x.user_id GROUP BY u.state) x " +
                " ON x.state = rows.state  GROUP BY rows.state, rows.rowOrdering, x.total, rows.productName ORDER BY  x.total DESC , rows.state, rows.rowOrdering DESC "

            ;

        }


    }

    return query.query(sql, null, function(err, result){
        if(err)
            return null;
        if( result.rowCount == 0 )
            return false;
        return result.rows;
    });
};



exports.displayNextButtons = function(categoryId, customerType){
    var categoryStmt = "";
    var customerSelection;
    if( categoryId >= 0)
        categoryStmt = " WHERE p.category = " + categoryId;
    if( customerType == "customer"){
        customerSelection = "name ";
    }
    else{ // filter by state
        customerSelection = "state";
    }

    var sql = " SELECT p.productCount, c.customer FROM (SELECT COUNT(p.id) AS productCount  FROM product_items p " + categoryStmt + ") AS p, " +
         " (SELECT COUNT(DISTINCT u." + customerSelection + " ) AS customer FROM users u ) AS c ";


    return query.query(sql, null, function(err, result){
        if(err)
            return null;
        if( result.rowCount == 0 )
            return false;
        return result.rows;
    });
};


