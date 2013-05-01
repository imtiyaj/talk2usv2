/**
 * Module dependencies.
 */

exports.sendSuccess = function (res, msg, data) {
    var out= {};
    out.stat_message= msg;
    out.children= data;
    out.success= true;
    res.format({
        html: function(){
            return res.render('500');
        },

        json: function(){
            res.contentType('json');
            return res.json(out);
        }
    });
}

exports.sendError = function (res, msg, err) {
    var out= {};
    out.stat_message= msg+err.toString();
    out.success= false;
    res.format({
        html: function(){
            return res.render('500');
        },

        json: function(){
            res.contentType('json');
            return res.json(out);
        }
    });
}

