var config = require('../config'),
    db = config.db;

exports.index = function(req, res, next) {
    db.query('select * from todo order by finished asc, id asc limit 50', function(err, rows) {
        if(err) return next(err);
        for (var i = 0, len = rows.length; i < len; i++){
            var date = new Date(rows[i].post_date);
            rows[i].upTime = date.getMonth() + "-" + date.getDate();// +" "+ date.getHours() + ":" + date.getMinutes();
            if(date.getMonth() < 10){
                rows[i].upTime = "0" + rows[i].upTime;
            }
        }
        res.render('todo_index.html', {todos: rows});
    });
};

exports.new = function(req, res, next) {
    var title = req.body.title || '';
    title = title.trim();
    if(!title) {
        return res.render('error', {message: '标题是必须的'});
    }
    db.query('insert into todo set title=?, post_date=now()', [title], function(err, result) {
        if(err) return next(err);
        res.redirect('/todo');
    });
};

exports.view = function (req, res, next) {
    res.redirect('/todo');
};

exports.edit = function(req, res, next) {
    var id = req.params.id;
    db.query('select * from todo where id=?', [id], function(err, rows) {
        if(err) return next(err);
        if(rows && rows.length > 0) {
            var row = rows[0];
            res.render('todo_edit.html', {todo: row});
        } else {
            next();
        }
    });
};

exports.save = function(req, res, next) {
    var id = req.params.id;
    var title = req.body.title || '';
    title = title.trim();
    if(!title) {
        return res.render('error', {message: '标题是必须的'});
    }
    db.query('update todo set title=?, post_date=now() where id=?', [title, id], function(err, result) {
        if(err) return next(err);
        res.redirect('/todo');
    });
};


exports.delete = function(req, res, next) {
    var id = req.params.id;
    db.query('delete from todo where id = ?', [id], function(err) {
        if(err) return next(err);
        res.redirect('/todo');
    });
};

exports.finish = function(req, res, next) {
    var finished = req.query.status === 'yes' ? 1 : 0;
    var id = req.params.id;
    db.query('update todo set finished=?, post_date=now() where id=?', [finished, id], function(err, result) {
        if(err) return next(err);
        res.redirect('/todo');
    });
};

