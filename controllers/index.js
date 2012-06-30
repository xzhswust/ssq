/**
 * Created with JetBrains WebStorm.
 * User: zoupeng
 * Date: 12-6-30
 * Time: 上午11:51
 * To change this template use File | Settings | File Templates.
 */
var config = require('../config');
var db = config.db;

exports.index = function(req, res, next){
    db.query('select * from history where id = (select MAX(id) from history)', function(err, rows) {
        if(err){
            return next(err);
        }
        var item = rows[0];
        item.id = item.id.toString().substr(4);
        item.first_reward = (item.first_reward / 10000).toFixed(2);
        item.second_reward = (item.second_reward / 10000).toFixed(2);
        item.sale = (item.sale / 10000).toFixed(2);
        res.render('index.html', {last: item});
    })
}
