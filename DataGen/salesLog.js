/**
 * Created by kyle on 6/1/16.
 */

var query = require("./database.js");

exports.getLastOrder = function(queries, newEntries){

	sql =
	" SELECT MAX(id) " +
	" FROM orders; "
	;

	var maxIdPromise = query.query(sql, null, function(err, result){
		if(err)
			return null;
		return result.rows;
	});

	sql =
	" SELECT proc_insert_orders(30, 10); ";



	maxIdPromise.then(function(lastOrder){
			console.log("lastOrder = %j", lastOrder);
			var t = query.query(sql, null, function(err, result){
				if(err)
					return null;
				if(result.rowCount == 0)
					return false;
				return result.rows;
			});
			t.then(function(x){});
			
			sql =
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

			return query.query(sql, null, function(err, result){
				if(err)
					return null;
				if(result.rowCount == 0)
					return false;
				return result.rows;
			});
		}
	);
};

exports.flushLogs = function(){

};

exports.initStateLog  = function(){

};

exports.initProductLog = function(){

};

exports.updateStateRow = function(){

};

exports.updateProductRow = function(){

};




