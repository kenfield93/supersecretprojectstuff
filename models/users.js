/**
 * Created by kyle on 4/12/16.
 */
var query = require("./database.js");

/*
  returns a promise. If users already exists the promise.then func will reject w/ null or false
  if user doesn't exist they will be added asynchronously nad promise.then will resolve with true.
   Actually for  dbPromise.then(resolveFunc(f), ...) f will be another promise f.then's func will be resolve or rejected and propogate it up
   i'm still not 100% sure how it works under the hood
 */
exports.createUser = function(userName, age, isOwner, state){

    userName = userName.trim().toLowerCase();

    var sql = ' SELECT users.name ' +
        ' FROM users' +
        ' WHERE users.name = \''+ userName + '\'';

    var dbPromise = query.query(sql, null, function(err, result){
        if(err) {
            return null;
        }
        // name already exists
        if(result.rowCount != 0){
            return false;
        }
        return true;
    });


    var createUsers = function() {
        sql = ' INSERT INTO users (name, age, owner, state) VALUES ' +
            ' ( \'' + userName + '\', ' + age + ', \'' + isOwner + '\', \'' + state + '\'  )';

        // returns promise
        return query.query(sql, null, function (err, result) {
            if (err) {
               return null;
            }
            return true;
        });

    }
     // right now this will reslove to true and reject to false but don't have a way of knowing if it rejects
    // due to something being null or because user name already exists in db
     return dbPromise.then(createUsers(), function(status){ return status; } );

}

// returns a promise w/ false if user doesn't exist and n_id and b_isOwner
exports.getSigninInfo = function(userName){
    userName = userName.trim().toLowerCase();
    var sql = ' SELECT users.id, users.owner, users.state ' +
        ' FROM users' +
        ' WHERE users.name = \''+ userName + '\'';

    var dbPromise = query.query(sql, null, function(err, result){
        if(err) {
            return null;
        }
        // user has account
        if(result.rowCount != 0){

            return { id : result.rows[0].id, isOwner: result.rows[0].owner, userState: result.rows[0].state};
        }
        // else user name isn't in db so no account exists for it
        return false;
    });

    return dbPromise;
}