/**
 * Created by kyle on 6/2/16.
 */

var query = require("./database.js");

var statePrecompTable = 'statetotal';

exports.mergeStateLog = function (){
    var sql = " UPDATE statetotal SET " +
            " totalspent = x.totalspent " +
            " FROM (SELECT statetotal.state, statetotal.category,  statetotal.totalspent + statelog.totalspent AS totalspent FROM statetotal, statelog " +
            " WHERE statetotal.state = statelog.state AND statetotal.category = statelog.category )x " +
            " WHERE statetotal.state = x.state AND statetotal.category = x.category"

    ;


    var p = query.query(sql, null, function(err, result){
        if(err)
            return null;
        return true;
    });

};



exports.mergeProductLog = function (){
    var sql = " UPDATE productTotal SET " +
            " totalspent = x.totalspent " +
            " FROM (SELECT productTotal.product, productTotal.category,  productTotal.totalspent + productlog.totalspent AS totalspent FROM productTotal, productlog " +
            " WHERE productTotal.product = productlog.product AND productTotal.category = productlog.category )x " +
            " WHERE productTotal.product = x.product AND productTotal.category = x.category"

        ;


    var p = query.query(sql, null, function(err, result){
        if(err)
            return null;
        return true;
    });
};
//

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



//

exports.initStatePrecomp  = function(){


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
            var sql = " INSERT INTO statetotal (state, totalspent, category) VALUES ( '" + state + "' , 0, " + category + " ) ";
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
            var sql = " INSERT INTO productTotal (product, totalspent, category) VALUES ( '" + pid + "' , 0, " + category + " ) ";
            promiseList.push(
                query.query(sql,  null, function(err, result){ return true; } )
            );
        }
    }, function(err){

    });
};