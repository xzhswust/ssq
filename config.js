exports.port = 80;
exports.email='jeffz@live.com';
exports.site_name = 'My ssq';
exports.site_desc = '';
exports.session_secret = 'tsoedsosisession_secretonsheecfrxedta';

var db_options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'passwd',
    database: 'todo'
};

var db = exports.db = new require('mysql').createClient(db_options);
//require("./lib/jscex.mysql").jscexify(db);
/*
db.connect(function(err) {
    if(err) {
        console.error('connect db ' + db.host + ' error: ' + err);
        process.exit();
    }
});
*/
