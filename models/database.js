/**
 * Created by kyle on 4/10/16.
 */
    /*TODO write error function for db errors that can be turned on or off
    TODO deal w/ concurency issues for all database actions. IDK if we have to actually manually do anything
     */
var pg = require('pg');
/* REQUIRES A POSTGRES DB CALLED 'project1' */
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/project2';

// THESE COMMENTS ARE WHAT CREATED THE TABLES, I HAD TO COMMENT OUT OR ELSE THEY GET CALLED
// EVERY TIME YOU START UP THE SERVER. PROBABLY NEED TO FIGURE OUT A CLEANER WAY TO DO THIS

/*
var users = 'CREATE TABLE users(' +
    'id SERIAL PRIMARY KEY, ' +
    'name TEXT unique not null CHECK ( length(name) > 0),' +
    'age  INTEGER not null CHECK( age > 0),' +
    'owner BOOLEAN not null,' +
    'state TEXT not null CHECK( length(state)>0) )'
    ;

var categories = 'CREATE TABLE categories(id SERIAL PRIMARY KEY,' +
                                     'name TEXT unique not null CHECK(length(name) > 0),' +
                                     'description TEXT not null CHECK(length(description) > 0),' +
                                     'creator INTEGER not null REFERENCES users(id))'
               ;

var product_items = 'CREATE TABLE product_items( id SERIAL PRIMARY KEY,' +
                                              'category INTEGER not null REFERENCES categories(id), ' +
                                              'name TEXT not null CHECK(length(name) > 0),' +
                                              'sku TEXT unique not null CHECK(length(sku) > 0),' +
                                              'price INTEGER not null CHECK(price > 0),' +
                                                'UNIQUE(name, category) )'
                   ;

var sales_records = 'CREATE TABLE sales_records( id SERIAL PRIMARY KEY,' +
                                                'date DATE not null,' +
                                                'buyer INTEGER not null REFERENCES users(id) )'
                    ;

var product_sold = 'CREATE TABLE product_sold( ' +
                                                'price INTEGER not null CHECK(price >0),' +
                                                ' quantity INTEGER not null CHECK(quantity > 0),' +
                                                ' product INTEGER not null REFERENCES product_items(id),' +
                                                ' sales_record INTEGER not null REFERENCES sales_records(id) )'
                  ;
*/

/*
var users = " CREATE TABLE users ( " +
    " id    SERIAL PRIMARY KEY, " +
    " name  TEXT NOT NULL UNIQUE, " +
    " owner BOOLEAN not null,  " +
    " age   INTEGER NOT NULL, " +
    " state char(2) NOT NULL ); "
    ;


var categories = " CREATE TABLE categories ( " +
    " id  SERIAL PRIMARY KEY, " +
    " name  TEXT NOT NULL UNIQUE, " +
    " description  TEXT NOT NULL, " +
    " creator INTEGER NOT NULL REFERENCES users(id) );"
    ;


var product_items = " CREATE TABLE product_items ( " +
    " id SERIAL PRIMARY KEY, " +
    "  category INTEGER REFERENCES categories (id) NOT NULL, " +
    " name TEXT NOT NULL, " +
    " sku TEXT unique not null CHECK(length(sku) > 0), " +
    " price FLOAT NOT NULL CHECK (price >= 0), " +
    " is_delete BOOLEAN  );"
   ;

// note is_delete is not needed for my implementation. I got rid of Not Null so it won't fuck up existing code
// but kept it so i won't have to change the datagenerator.
//  if it fucks up the code i'll get rid of it and change the datagenerator
//


var orders = " CREATE TABLE orders ( " +
    " id SERIAL PRIMARY KEY, " +
    " user_id INTEGER REFERENCES users (id) NOT NULL, " +
    " product_id INTEGER REFERENCES product_items (id) NOT NULL, " +
    " quantity INTEGER NOT NULL, " +
    " price FLOAT NOT NULL CHECK (price >= 0), " +
    " is_cart BOOLEAN );"
    ;

*/

/*
 var stateLog = " CREATE TABLE stateLog ( " +
     " state char(2) NOT NULL, " +
     " totalSpent INTEGER , " +
     " category INTEGER ) "
 ;

 var productLog = " CREATE TABLE productLog ( " +
         " product  INTEGER, " +
         " totalSpent INTEGER, " +
         " category INTEGER ) "
     ;

 var stateTotal = " CREATE TABLE stateTotal ( " +
 " state char(2) NOT NULL, " +
 " totalSpent INTEGER , " +
 " category INTEGER ) "
 ;

 var productTotal = " CREATE TABLE productTotal ( " +
 " product  INTEGER, " +
 " totalSpent INTEGER, " +
 " category INTEGER ) "
 ;

pg.connect(connectionString, function(err, client, done){

  // client.query(stateLog);
   // client.query(productLog);
    client.query(stateTotal);
    client.query(productTotal);
    done();
});

*/


/*
pg.connect(connectionString, function(err, client, done){
    var createUsers = client.query(users);
    var createCategory = client.query(categories);
    var createProduct  = client.query(product_items);
    var createOrders   = client.query(orders);
  //  var createSalesRecords = client.query(sales_records);
  //  var createProductSold = client.query(product_sold);

    done();
});

*/


/*
/* Basic Interface for talking to the db via pg module. Returns a promise with the outcome
*  of w/e callback function you pass in.
*  */
module.exports = {

    query: function(text, values, cb) {
        return new Promise( function(resolve, reject) {
                pg.connect(connectionString, function (err, client, done) {
                    client.query(text, values, function (err, result) {
                        var outcome;
                        done();
                        outcome = cb(err, result);
                        if( outcome == false || outcome == null) {
                            reject(err);
                        }
                        else {
                            resolve(outcome);
                        }
                    })
                });
            }
        );
    }
}
