/**
 * Created by kyle on 6/1/16.
 */

var query = require("./database.js");

exports.getLastOrder = function(){

    var sql = " SELECT MAX(id) FROM orders; ";

    var maxPromise = query.query(sql, null, function(err, result){
        if(err)
            return null;
        if(result.rowCount == 0)
            return false;
        return result.rows;
    });

    maxPromise.then( function(orderIndex) {
        console.log("orderIndex = %j", orderIndex);
        lastOrder = orderIndex[0].max;
        console.log(lastOrder);
        return lastOrder;
    }, function(err) {
        //console.log(err)
    });
};

exports.insertOrders = function(/*queries, newEntries*/){

    var sql = "";
/*
    sql +=
    " SELECT MAX(id) " +
    " FROM orders; "
    ;

    var maxIdPromise = query.query(sql, null, function(err, result){
        if(err)
            return null;
        return result.rows;
    });

    sql =
    " SELECT proc_insert_orders(" + queries + ", " + newEntries + "); ";


    maxIdPromise.then(function(orderIndex){

        lastOrder = orderIndex[0].max;

        var t = query.query(sql, null, function(err, result){
            if(err)
                return null;
            if(result.rowCount == 0)
                return false;
            return result.rows;
        });
        t.then(function(x){});

        sql =
        " CREATE OR REPLACE VIEW newestOrders AS " +
        " WITH recentOrders AS " +
        " (SELECT orders.id AS oid, user_id AS uid, state, product_id AS pid, price AS totalSpent " +
        " FROM orders " +
        " INNER JOIN users " +
        " ON user_id = users.id " +
        " WHERE orders.id > " + lastOrder + ") " +

        " SELECT oid, state, totalSpent, pid, category " +
        " FROM recentOrders " +
        " INNER JOIN product_items " +
        " ON recentOrders.pid = product_items.id " +
        " ORDER BY oid; "
        ;

        query.query(sql, null, function(err, result){
            if(err)
                return null;
            if(result.rowCount == 0)
                return false;
        });

        sql =
        " SELECT * " +
        " FROM newestOrders "
        ;

        var q = query.query(sql, null, function(err, result){
            if(err)
                return null;
            if(result.rowCount == 0)
                return false;
            console.log("somewhere in insertOrders");
            console.log("q = %j", q);
            return result.rows;
        });
*/
/*
        p.then(function(outcome){
            promiseList = [];
            console.log("outcome = %j", outcome);
            console.log("outcome.length = " + outcome.length);
            var state, totalSpent, pid, category;
            for(i = 0; i < outcome.length; i++){
                state = outcome[i].state;
                totalSpent = outcome[i].totalspent;
                pid = outcome[i].pid;
                category = outcome[i].category;
                var sql = " UPDATE stateLog SET totalspent =  " +
            "(SELECT totalspent + " + totalSpent + " FROM stateLog WHERE state = '" + state + "' AND category = '" + category + "' )  " +
            " WHERE state = '" + state + "' AND category = '" + category + "' ";
                promiseList.push(
                    query.query(sql,  null, function(err, result){ return true; } )
                );
                sql = " UPDATE productLog SET totalspent =  " +
            "(SELECT totalspent + " + totalspent + " FROM productLog WHERE product = '" + pid + "' AND category = '" + category + "' )  " +
            " WHERE product = '" + pid + "' AND category = '" + category + "' ";
                promiseList.push(
                    query.query(sql,  null, function(err, result){ return true; } )
                );
            }
        }, function(err){
        });
    });
*/
};

exports.flushLogs = function(){

    var sql = " UPDATE statelog SET totalspent = 0; UPDATE productlog SET totalspent = 0; ";
    query.query(sql, null, function(err, result){return true;});

};

exports.initStateLog  = function(){


   var sql = "";

   sql += " SELECT state, id FROM states, ( SELECT id FROM categories UNION SELECT '-1' ) c; ";
   var p = query.query(sql, null, function(err, result){
        if(err)
            return null;
        if(result.rowCount == 0)
            return false;
        return result.rows;
    });
    p.then(function(outcome){
        promiseList = [];
        console.log("outcome.length = " + outcome.length);
        var state, category;
        for(i = 0; i < outcome.length; i++){
            state = outcome[i].state;
            category = outcome[i].id;
            var sql = " INSERT INTO statelog (state, totalspent, category) VALUES ( '" + state + "' , 0, " + category + " ) ";
            promiseList.push(
                query.query(sql,  null, function(err, result){ return true; } )
            );
        }
    }, function(err){

    });
};

exports.initProductLog = function(){
    var sql = " ";

    sql += " SELECT p.id AS product , c.id AS category FROM product_items p, categories c WHERE p.category = c.id ;";

    var p = query.query(sql, null, function(err, result){
        if(err)
            return null;
        if( result.rowCount == 0 )
            return false;
        return result.rows;
    });

    p.then(function(outcome){
        promiseList = [];
        console.log("outcome = %j " , outcome);
        var pid, category;
        for(i = 0; i < outcome.length; i++){
            pid = outcome[i].product;
            category = outcome[i].category;
            var sql = " INSERT INTO productlog (product, totalspent, category) VALUES ( '" + pid + "' , 0, " + category + " ) ";
            promiseList.push(
                query.query(sql,  null, function(err, result){ return true; } )
            );
        }
    }, function(err){

    });
};

// takes an array of json object w/ obj.state, obj.totalspent, obj.category.
// obj.category == 1 signifies row for total aggregate of that value

exports.updateStateRow = function(rows){
    promiseList = [];
    var sql, state, totalspent, category;
    for( i = 0; i < rows.length; i++){
        state = rows[i].state;
        totalspent = rows[i].total;
        category = rows[i].category;
        sql = " UPDATE stateLog SET totalspent =  " +
            "(SELECT totalspent + " + totalspent + " FROM stateLog WHERE state = '" + state + "' AND category = '" + category + "' )  " +
            " WHERE state = '" + state + "' AND category = '" + category + "' ";
        promiseList.push(
            query.query(sql, null, function(err, result){return true;})
        )
    }
};

exports.updateProductRow = function(rows){
    promiseList = [];
    var sql, pid, totalspent, category;
    for( i = 0; i < rows.length; i++){
        pid = rows[i].pid;
        totalspent = rows[i].total;
        category = rows[i].category;
        console.log("fuck me ");
        sql = " UPDATE productLog SET totalspent =  " +
            "(SELECT totalspent + " + totalspent + " FROM productLog WHERE product = '" + pid + "' AND category = '" + category + "' )  " +
            " WHERE product = '" + pid + "' AND category = '" + category + "' ";
        promiseList.push(
            query.query(sql, null, function(err, result){return true;})
        )
    }
};




