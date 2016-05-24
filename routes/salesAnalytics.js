/**
 * Created by kyle on 5/19/16.
 */
var category = require("../models/category");
var analytics = require("../models/analytics");

exports.get = function(req, res, next){
    //order=alphabetic&rows=customer&cols=all&displayAnal=true
    console.log("hell? " + req.query.displayAnal);
    if((! req.query.displayAnal) && (! req.query.nextCustomer) && (! req.query.nextProduct) ) {
        req.session.productOffset = 0;
        req.session.customerOffset = 0;
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
        if( req.query.nextCustomer )
            req.session.customerOffset += 10;
        if( req.query.nextProduct )
            req.session.productOffset+= 20;

        // else run query was pressed so display z chart
        var orderBy = req.query.order;
        var sortUsers = req.query.rows; // rows of chart (by consumers or states)
        var sortProducts = req.query.cols; // columns of chart ( by category, either all cats, or a specific one)

        /* testing similarProd */

        var similarPromise = analytics.pv();
        similarPromise.then(function(outcome){
            console.log("\n\n");
            console.log("similar Prod %j", outcome);
            console.log("\n\n");
        }, function(err){
            console.log("\n\n");
            console.log("similar Prod error %j", err);
            console.log("\n\n");
        });

        /*  done testing similarProd               */
        var columnPromise = analytics.getColumns(sortProducts, orderBy, req.session.productOffset);
        var cellPromise = analytics.getCells(sortProducts, orderBy, sortUsers, req.session.productOffset, req.session.customerOffset);
        columnPromise.then( function(cols) {
            console.log(" columns %j", cols);
            cellPromise.then(function(cell){
                var chart = createChart( cols,  cell);
                if( (! req.query.nextCustomer) && (! req.query.nextProduct)  ) {
                    var catDropDown = category.getCategories();
                    catDropDown.then(function (dropCat) {
                            var dropDown = createCategoryDropDown(dropCat);
                            res.render('Owner/salesAnalytics', {
                                userName: req.session.name,
                                categoryDropDown: dropDown,
                                chart: chart,
                                nextUsers: createNextCustomerButton(isName(cell[0]), true),
                                nextProducts: createNextProductButton(true)
                            });
                        }, function (err) {
                            res.render('Owner/salesAnalytics', {userName: req.session.name});
                        }
                    );
                }
                else{
                    if(true) // if there is some next to display
                    res.render('Owner/salesAnalytics', {
                            userName: req.session.name,
                            chart: chart,
                            displayFilters: "display: none;",
                            nextUsers: createNextCustomerButton(isName(cell[0]), true),
                            nextProducts: createNextProductButton(true)
                        }
                    );
                }
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
    console.log("yo %j", columnsTitles);

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
    console.log("leaf %j", rows);

    for( i = 0; i < rows.length; i++){
        names[getName(rows[i])] = "<tr> <td> <b> " + getName(rows[i]) + " $ " + rows[i].total + "</b> </td> ";
    }


    currName = "";
    console.log("ello matey %j", cells);
    console.log("Cells.length = " + cells.length);
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
    console.log("bobo ", array.length);
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
        return "<button name='nextCustomer' value='true' type='submit'>NEXT 20 " + customerTitle + " </button>";
    return "";
}

createNextProductButton = function(display){
    if( display)
        return "<button name='nextProduct' value='true' type='submit'>Next 10 Products </button>";
    return "";
}