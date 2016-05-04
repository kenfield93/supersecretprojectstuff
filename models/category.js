/**
 * Created by kyle on 4/16/16.
 */
/*TODO deal w/ concurency issues */
var query = require("./database.js");
var categoryTable = 'categories';
var productTable = 'product_items';
/* Since doing work on db is async (i think this is due to how the pg module works) we are using js's Promise
   features. I suggest leaving this to me(Kyle) unless you want to spend time learning them and they're confusing

   Returns a promise where a successful action holds an array of JSON objects where each JSON object
   represents a row in the db.
   On failure the promise will contain false
   Note: For elementary use you can think of Promises as a wrapper for successful and unsuccessful actions but
         it's more complicated, especially becuase the  then(func() ) returns either  promise or undefined. The point of this
         is so you can chain promises together which I used in other places in this project
 */
exports.getCategories = function(){


    var sql = "SELECT * " +
              "FROM " + categoryTable;
    var dbPromise = query.query(sql, null, function(err, result){
       if(err){
           return false;
       }
        if(result.rowCount != 0){
            //console.log("id = " + result.rows[0].id);
            //console.log("isOwner = " + result.rows[0].owner);
            //console.log("Result: %j", result.rows);
            return result.rows;
        }
        // else user name isn't in db so no account exists for it
        return false;
    });
    return dbPromise;
};

/* title is name of category(unique non null str), description is the description(non null)
   userID is primary key of the owner who is trying to create the category
 */
exports.createCategory = function(title, description, userID){

    var createCategory = function (){
        sql = "BEGIN; INSERT INTO " + categoryTable +
                " (name, description, creator) " +
                " VALUES ('" + title + " ',' " + description + " ',' " + userID + " '); COMMIT;"
        ;

        return query.query(sql, null, function(err, result){
            if( err  ){
                return null;
            }
            return true;
        });
    }
    return createCategory();
}

exports.deleteCategory = function(categoryId){

  var sql = "BEGIN; DELETE FROM " + categoryTable +
          " AS c WHERE c.id = '" + categoryId + "'; COMMIT;"
      ;
  return query.query(sql, null, function(err, result){
      if(err){
          return null;
      }
      return true;
  });

};

exports.hasSomeProducts = function( ){

    var sql = "SELECT  p.category " +
            " FROM  " + productTable + " p"
           // " WHERE p.category = '" + categoryId + "' "
    ;

    var dbPromise = query.query(sql, null, function(err, result){
        if(err){
            return null;
        }
        return result.rows;
    }) ;

    return dbPromise;
};

exports.hasNoProducts = function(catId){

    var sql = "SELECT  p.category " +
            " FROM  " + productTable + " p" +
     " WHERE p.category = '" + catId + "' "
        ;

    var dbPromise = query.query(sql, null, function(err, result){
        if(err){
            return null;
        }
        if( result.rowCount == 0)
           return true;
        return false;
    }) ;

    return dbPromise;
};

exports.updateCategory = function( categoryId, title, description){

    var sql = " BEGIN; UPDATE " + categoryTable +
            " SET name = '" + title + "' , description = '" + description +
            "' WHERE id='" + categoryId + "'; COMMIT;"
    ;

    var dbPromise = query.query(sql, null, function(err, result){
        if(err){
            return null;
        }
        return true;
    });

    return dbPromise;
}

