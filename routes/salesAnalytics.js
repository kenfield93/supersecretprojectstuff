/**
 * Created by kyle on 5/19/16.
 */
var category = require("../models/category");
var analytics = require("../models/analytics");
var salesLog = require("../models/salesLog");
var query = require("../models/database");

exports.get = function(req, res, next){
    if( req.query.test1 ){


        // Get aggregates of these rows server side and split into the stateRow and productRow
        // salesLog.initProductLog();
        // salesLog.initStateLog();


        /*
        var productrow = [{pid: 2, total: 19, category: 1 }];
        var staterow = [{state: 'CA', total: 69, category: 2}];
        salesLog.updateProductRow(productrow);
        salesLog.updateStateRow(staterow);
        */
    }
    //res.setTimeout(10, function(){});
    //order=alphabetic&rows=customer&cols=all&displayAnal=true
    if(!req.query.displayAnal) {

        var catDropDown = category.getCategories();
        catDropDown.then(function(outcome){
                var dropDown = createCategoryDropDown(outcome);
                res.render('Owner/salesAnalytics', {userName: req.session.name, categoryDropDown: dropDown});
            }, function( err ){
                res.render('Owner/salesAnalytics', {userName: req.session.name} );
            }
        );
    }
    else {
        // else run query was pressed so display z chart
        var sortUsers = "state"; // rows of chart (by consumers or states)
        var sortProducts = req.query.cols; // columns of chart ( by category, either all cats, or a specific one)

        /* Testing insertOrders */
        var lastOrder = salesLog.getLastOrder();
        console.log(lastOrder);
        // console.log("Calling insertOrders");
        // var views = salesLog.insertOrders(25, 5);




        //console.log("views = %j", views);
        //salesLog.updateStateRow(views.rows);
        //salesLog.updateProductRow(views.rows);
        /*  Done testing insertOrders */

        var columnPromise = analytics.getColumns(sortProducts, 0);
        var cellPromise = analytics.getCells(sortProducts , sortUsers, 0,0);
        columnPromise.then( function(cols) {
            console.log(" columns %j", cols);
            cellPromise.then(function(cell){
                var chart = createChart( cols,  cell);
                    var catDropDown = category.getCategories();
                    catDropDown.then(function (dropCat) {
                        console.log("oh no");
                            var dropDown = createCategoryDropDown(dropCat);


                                res.render('Owner/salesAnalytics', {
                                    userName: req.session.name,
                                    categoryDropDown: dropDown,
                                    chart: chart
                                });

                                res.render('Owner/salesAnalytics', {
                                    userName: req.session.name,
                                    categoryDropDown: dropDown,
                                    chart: chart
                                });

                        }, function (err) {
                            res.render('Owner/salesAnalytics', {userName: req.session.name});
                        }
                    );

            });

        } );
    }
};

function isName(obj){
    if(obj.name != undefined)
        return "name";
    return "state";
}
function getName(obj){
    if(obj.name != undefined)
      return obj.name;
    return obj.state;
}


function createChart(columnsTitles, cells){

    var html = "<tr> ";
       html += "<td> XXXX </td>";
        var currName = "";
        var prevName = "";
        var productMap = {};

       for( i = 0; i < columnsTitles.length; i++){
            html += " <td><b> " + getName(columnsTitles[i]) + " $" + columnsTitles[i].total + " </b></td> ";
         //   html += " <td><b></b>";
           productMap[getName(columnsTitles[i])] = getName(columnsTitles[i]);

    }
    html += " </tr>";

    var products = Object.keys(productMap).map(function (key) {return productMap[key]});
    var names = {};
    var rowsObj = {};

    for(i = 0; i < cells.length; i++) {
        rowsObj[getName(cells[i])] = {name: getName(cells[i]), total : cells[i].aggregate };
    }
    var rows = Object.keys(rowsObj).map(function(key){ return rowsObj[key]});

    for( i = 0; i < rows.length; i++){
        names[getName(rows[i])] = "<tr> <td> <b> " + getName(rows[i]) + " $ " + rows[i].total + "</b> </td> ";
    }

    currName = "";
    if(rows.length > 0)
        currName = getName(rows[0]);

    for( i = 0; i < cells.length; i++){
            if( currName != getName(cells[i])) {
                names[currName] += " </tr>";
                currName = getName(cells[i]);
            }
            names[getName(cells[i])] += " <td> $" + cells[i].total + " </td>";
    }
    if( rows.length > 0)
        names[currName] += " </tr>";

    var array = Object.keys(names).map(function (key) {return names[key]});
    for( i = 0; i < array.length; i++)
        html += array[i];

    return html;
}

createCategoryDropDown = function(categories){
    if (categories.length == 0)
        return "";

    var html = "";
    for( i = 0; i < categories.length; i++){
        html += " <option value='" + categories[i].id + "'>" + categories[i].name + "</option> " ;
    }

    return html;
};

createNextCustomerButton = function(customerTitle, display){
   if (display)
        return "<button name='nextCustomer' value='true' type='submit'>NEXT 10 " + customerTitle + " </button>";
    return "";
}

createNextProductButton = function(display){
    if( display)
        return "<button name='nextProduct' value='true' type='submit'>Next 20 Products </button>";
    return "";
}