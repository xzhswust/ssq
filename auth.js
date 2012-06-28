// JavaScript Document

function user_login(req, res, next, mysql) {
    if (!req.body['user'] || !req.body['passwd']) {
        res.redirect('/login.html');
        return;
    }

    request = req;
    response = res;

    var sql = 'select name from users where name=\'' + req.body['user'] + '\' and passwd=\'' + req.body['passwd'] + '\'';
    mysql.query(sql, function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }

        //auth success
        if (results.length > 0) {
            request.session.user = request.body['user'];
            response.cookie(request.body['user'], '', { maxAge:50000 });
            console.log(request.session.user + " :login  in");
            response.send('success');
            return;
        }

        //auth failed
        console.log(request.body['user'] + " :login  failed");
        response.send('wrong user');
    });
}

function user_logout(req, res, next) {
    console.log(req.session.user + " :logout");
    res.clearCookie(req.session.user);
    req.session.user = "";
    res.redirect('/login.html');
    return;
}

exports = module.exports = function auth(mysql, options) {
    options = options || {};

    if (!mysql) {
        throw new Error('parameters mysql needed');
    }
    options.mysql = mysql;

    if (!options.anomy) {
        options.anomy = false;
    }

    return function auth(req, res, next) {
        if (req.url == '/logout') {
            user_logout(req, res, next);
            return;
        }

        if (req.url == '/login') {
            user_login(req, res, next, options.mysql);
            return;
        }

        if (!options.anomy && (req.session.user == undefined || req.session.user == "")) {
            if(/\.(js|css|ico|png)$/.test(req.url))
            {
                next();
                return;
            }

            if (req.url != '/login.html') {
                res.redirect('/login.html');
                console.log("redirect to login urel= ", req.url);
                return;
            }
        }
        next();
    };
};