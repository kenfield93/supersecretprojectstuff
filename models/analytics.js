/**
 * Created by kyle on 5/20/16.
 */

var query = require("./database.js");

 exports.getColumns = function ( categoryId, orderBy){
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
             " LIMIT 20 ) " +

             " SELECT topProducts.name AS name, coalesce(SUM(o.price * o.quantity), 0) AS total " +
             " FROM topProducts LEFT JOIN orders o " +
             " ON topProducts.id = o.product_id " +
             " GROUP BY topProducts.name" +
             " ORDER BY topProducts.name; "
         ;
     }
     else{

     }

     return query.query(sql, null, function(err, result){
         if(err)
             return null;
         if( result.rowCount == 0 )
             return false;
         return result.rows;
     });
 };


exports.getCells = function(categoryId, orderBy, customerFilter){
    console.log("naos");
    var categoryStmt = "";
    var categoryTopK = "";
    var customerSelection = "";
 console.log("wtf");
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

    console.log("wtf");
    var sql = "";
    if( orderBy == "alphabetic") {
     sql = " WITH topCustomers AS " +
        " (SELECT u.id, u." + customerSelection +
        " FROM users u " +
        " ORDER BY u." + customerSelection +
        " LIMIT 10 ) " +
            //

         ", topProducts AS " +
         "(SELECT p.id, p.name " +
         " FROM product_items p " + categoryStmt +
         " GROUP BY p.id, p.name " +
         " ORDER BY p.name " +
         " LIMIT 20 ) " +
            // need to filter out products

             //
         ", categoryProducts AS " +
         " (SELECT p.id FROM product_items p " + categoryStmt + " )" +

         ", filteredProducts AS " +
         " (SELECT o.price, o.quantity, o.user_id" +
         " FROM categoryProducts, orders o" +
         " WHERE categoryProducts.id = o.product_id " +
         " )" +
            //
         " SELECT rows.name, rows.total, coalesce(SUM(f.price * f.quantity), 0 ) as aggregate "  +
         " FROM  (SELECT rows.userName as name, rows.productName, rows.user, coalesce(SUM(o.price * o.quantity), 0) as total " + //rows.userName AS name, coalesce(SUM(o.price * o.quantity),0)" +
         " FROM (SELECT u.id as user, p.id as product, u.name as username, p.name as productname FROM topCustomers u , topProducts p " +
         " ORDER BY u.name, u.id, p.name, p.id ) rows " +
         " LEFT JOIN orders o ON o.product_id = rows.product AND o.user_id = rows.user " +
         " GROUP BY rows.userName, rows.user, rows.productName ORDER BY rows.userName, rows.productName ) rows LEFT JOIN filteredProducts f ON rows.user = f.user_id GROUP BY rows.total, rows.user, rows.Name, rows.productName ORDER BY rows.name, rows.productName "

             /*
         " SELECT rows.userName as name, coalesce(SUM(o.price * o.quantity), 0) as total " + //rows.userName AS name, coalesce(SUM(o.price * o.quantity),0)" +
             " FROM (SELECT u.id as user, p.id as product, u.name as username, p.name as productname FROM topCustomers u , topProducts p " +
                    " ORDER BY u.name, u.id, p.name, p.id ) rows " +
             " LEFT JOIN orders o ON o.product_id = rows.product AND o.user_id = rows.user " +
            " GROUP BY rows.userName, rows.productName ORDER BY rows.userName, rows.productName "
            */
        ;

    }
    else{

    }

    return query.query(sql, null, function(err, result){
        if(err)
            return null;
        if( result.rowCount == 0 )
            return false;
        return result.rows;
    });
};
/*
 1. Column names is the name of each product w/ the aggregate sales in paren.
 only shows 10 products at a time. Probably display N/A if there aren’t 10 products that meet filter criteria
 aggregate sales is 0 and is still displayed if none of that item was bought
 NOTE: ask if the aggregate sales is of the 20 current customers/states  or all of them
 */

// returns



exports.getRows = function (categoryId, orderBy, customerFilter){
    var categoryStmt = "";
    var categoryTopK = "";
    var customerSelection = "";

    if( categoryId >= 0){
        categoryStmt = " WHERE p.category = " + categoryId + " ";
        categoryTopK = " JOIN product_items p ON o.product_id = p.id "
    }
    if( customerFilter == "customer"){
        customerSelection = "name ";
    }
    else{ // filter by state
        customerSelection = "state";
    }


    var sql = "";
    if( orderBy == "alphabetic") {
        sql +=
            // get getustomer info
            " WITH topCustomers AS " +
            " (SELECT u.id, u." + customerSelection +
            " FROM users u " +
            " ORDER BY u." + customerSelection +
            " LIMIT 10 ) " +

            ", categoryProducts AS " +
            " (SELECT p.id FROM product_items p " + categoryStmt + " )" +

          ", filteredProducts AS " +
            " (SELECT o.price, o.quantity, o.user_id" +
            " FROM categoryProducts, orders o" +
            " WHERE categoryProducts.id = o.product_id " +
            " )" +



            " SELECT  topCustomers.name, coalesce( SUM(filteredProducts.price * filteredProducts.quantity), 0) AS total" +
            " FROM ( topCustomers " +
            " LEFT JOIN filteredProducts " +
            " ON topCustomers.id = filteredProducts.user_id) " +
            " GROUP BY  topCustomers.name " +
            " ORDER BY topCustomers.name" +
            "  "


        ;
    }
    // TODO: might be a problem where price of a product was changed so that and order's price aren't in synch
    // can i use a view to not have to use SUM (..) for SELECT and ORDER BY ?
    else { //top K

        sql += "WITH topProducts AS  " +

                " ( SELECT o.product_id, coalesce( SUM(o.price * o.quantity), 0) AS total " +
                " FROM orders o " + categoryTopK +
                " GROUP BY o.product_id, o.price" +
                " ORDER BY SUM(o.price * o.quantity) DESC" +
                " LIMIT 20)  " +

               " SELECT p.name, coalesce(topProducts.total,0) as total " +
               " FROM topProducts RIGHT JOIN  product_items p " +
               " ON topProducts.product_id = p.id " + categoryStmt +
               " ORDER BY coalesce(topProducts.total, 0) DESC; "
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



