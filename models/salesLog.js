/**
 * Created by kyle on 6/1/16.
 */

var query = require("./database.js");


exports.getOrderUpdates = function(){

};

exports.flushLogs = function(){

   var sql = " UPDATE statelog SET totalspent = 0; UPDATE productlog SET totalspent = 0; ";
    query.query(sql, null, function(err, result){ return true;});

};

exports.initStateLog  = function(){


   var sql = "";

   sql += " SELECT state, id FROM states, ( SELECT id FROM categories UNION SELECT '-1' ) c;";
   var p = query.query(sql, null, function(err, result){
        if(err)
            return null;
        if( result.rowCount == 0 )
            return false;
        return result.rows;
    });
    p.then( function(outcome){
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

    p.then( function(outcome){
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




