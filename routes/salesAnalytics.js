/**
 * Created by kyle on 5/19/16.
 */
var category = require("../models/category");
var analytics = require("../models/analytics");

exports.get = function(req, res, next){
    //order=alphabetic&rows=customer&cols=all&displayAnal=true
    console.log("hell? " + req.query.displayAnal);
    if(! req.query.displayAnal ) {
        console.log("wat?");
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
        console.log("hello?");
        // else run query was pressed so display z chart
        var orderBy = req.query.order;
        var sortUsers = req.query.rows; // rows of chart (by consumers or states)
        var sortProducts = req.query.cols; // columns of chart ( by category, either all cats, or a specific one)

      //  var productPromise = analytics.getColumns(sortProducts, orderBy);
       // var rowPromise = analytics.getRows(sortProducts, orderBy, sortUsers);
        var columnPromise = analytics.getColumns(sortProducts, orderBy);
        console.log("sheeeit");
        var cellPromise = analytics.getCells(sortProducts, orderBy, sortUsers);
        console.log("shoot");
        columnPromise.then( function(cols) {
            console.log("me");
            console.log("pretty");
            cellPromise.then(function(cell){
                console.log("plz");
                var chart = createChart( cols,  cell);
                var catDropDown = category.getCategories();
                catDropDown.then(function (dropCat) {
                    console.log("senpai");
                    var dropDown = createCategoryDropDown(dropCat);
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



function createChart(columnsTitles, cells){

    var html = "<tr> ";
       html += "<td> XXXX </td>";
        var currName = "";
        var prevName = "";
        var productMap = {};
    console.log("yo %j", columnsTitles);

       for( i = 0; i < columnsTitles.length; i++){
            html += " <td><b> " + columnsTitles[i].name + " $" + columnsTitles[i].total + " </b></td> ";
         //   html += " <td><b></b>";
           productMap[columnsTitles[i].name] = columnsTitles[i].name;

    }
    html += " </tr>";

    var products = Object.keys(productMap).map(function (key) {return productMap[key]});
    var names = {};
    var rowsObj = {};

    for(i = 0; i < cells.length; i++) {
        rowsObj[cells[i].name] = {name: cells[i].name, total : cells[i].aggregate };
    }
    var rows = Object.keys(rowsObj).map(function(key){ return rowsObj[key]});
    console.log("leaf %j", rows);

    for( i = 0; i < rows.length; i++){
        names[rows[i].name] = "<tr> <td> <b> " + rows[i].name + " $ " + rows[i].total + "</b> </td> ";
    }


    currName = "";
    console.log("ello matey %j", cells);
    if(rows.length > 0)
        currName = rows[0].name;

    for( i = 0; i < cells.length; i++){
            if( currName != cells[i].name) {
                names[currName] += " </tr>";
                currName = cells[i].name;
            }
            names[cells[i].name] += " <td> $" + cells[i].total + " </td>";
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