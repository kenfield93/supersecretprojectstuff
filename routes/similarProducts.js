/**
 * Created by kyle on 5/22/16.
 */

var similarProducts  = require("../models/similarProducts");

exports.get = function(req, res, next){
    var prodPromise = similarProducts.getSimilarPage();
    prodPromise.then( function(outcome) {
        console.log("hey yall %j", outcome);
            res.render('Owner/similarProducts', {userName: req.session.name, table: createChart(outcome)});
        }
    );
};



function createChart(rows){
    var html = "<tr> <td> Product 1 </td> <td> Product 2 </td>  </tr>";

    for(i = 0; i < rows.length; i++){
        html += "<tr> <td> " + rows[i].product_1 + " </td> <td> " + rows[i].product_2 + " </td></tr> " ;
    }

    return html;
}