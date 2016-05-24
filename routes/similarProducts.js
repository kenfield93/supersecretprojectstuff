/**
 * Created by kyle on 5/22/16.
 */

//var similarProducts  = require("../models/similarProducts");

exports.get = function(req, res, next){
 console.log("ayoh");
    res.render('Owner/similarProducts');
};



function createChart(rows){
    var html = "<tr> <td> Product 1 </td> <td> Product 2 </td> <td> Cosine </td> </tr>";

    for(i = 0; i < rows; i++){
        html += "<tr> <td> " + rows[i].p1 + " </td> <td> " + rows[i].p2 + " </td> <td> " + rows[i].cosine + " </td> </tr> " ;
    }

    return html;
}