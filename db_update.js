
var Jscex = require("jscex");
require("jscex-parser").init();
require("jscex-jit").init()

var fs = require('fs');
var mysql = require('mysql').Client;
var http = require('http');
var mysqlcli = new mysql();

function mysql_init(){
    mysqlcli.host = 'localhost';
    mysqlcli.port = 3306;
    mysqlcli.user = 'root';
    mysqlcli.password = 'passwd';
    mysqlcli.database = 'itquan';
}

var web_options = {
    host: 'kaijiang.500wan.com',
    port: 80,
    path: '/ssq.shtml',
    method: 'GET'
};

var ssq_base_file = "./ssq_base_data.txt"
var local_max_id = 0;
var web_max_id = 0;
var next_update_day = 0;

function read_base_data(filename){
    var buffer = fs.readFileSync(filename, "ascii");
    var all_data = buffer.toString("ascii");
    var data_lines = all_data.split("\n");
    var ssq_items = new Array();

    for(line in data_lines){
        if(data_lines[line].length > 20){
            var items = data_lines[line].split("\t");
            items[12] = "\"" + items[12] + "\"";
            ssq_items.push(items);
        }
    }
    var sql = "insert into dbcb(id,r1,r2,r3,r4,r5,r6,blue,sum_red,sum_all,ac,sd," +
        "date,sale,first_count,first_reward, second_count,second_reward,third_count,third_reward) values(";

    for(id in ssq_items){
        for(ids in ssq_items[id]){
            sql += ssq_items[id][ids];
            if(ids < ssq_items[id].length - 1){
                sql += ",";
            }
        }
        sql += "),(";
    }

    sql = sql.substr(0, sql.length - 2);
    mysqlcli.query(sql, function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        mysqlcli.end();
        console.log("Update dbcb success");
    });
}

function db_query(db, sql){
    db.query(sql, function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
}
var db_query = eval(jscex.compile())

function init_dbcb(){
    var sql = "delete from dbcb;"
    mysqlcli.query(sql, function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        console.log("Clear dbcb success");
        read_base_data(ssq_base_file);
    });
}

function update_local_data(){
    var sql = "select max(id) from dbcb;";
    mysqlcli.query(sql, function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }
        if (results.length <= 0) {
            console.log("Sql err: " + sql);
            return -1;
        }

        local_max_id = results[0]["max(id)"];
        if(local_max_id == null){
            local_max_id = "2003000";
        }

        local_max_id = parseInt(local_max_id) - 2000000 + "";
        mysqlcli.end();
        check_web_data();
    });
}

function get_max_web_id(html){
    var str_start = html.indexOf("td_title01", 0);
    if(index_start < 0){
        return nul1;
    }
    var id_str = html.substr(str_start, 128);
    var index_start = id_str.indexOf("<strong>", 0);
    if(index_start < 0){
        return null;
    }
    id_str = id_str.substr(index_start + 8, 5);

    return id_str;
}

function check_web_data(){
    web_options.host = 'kaijiang.500wan.com';
    web_options.path =  '/ssq.shtml';
    web_options.method =  'GET';

    var newreq = http.request(web_options, function(res) {
        var html = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            html += chunk;
        });

        res.on('end', function () {
            web_max_id = get_max_web_id(html);
            if(web_max_id && web_max_id > local_max_id ){
                var start = parseInt(local_max_id);
                var end = parseInt(web_max_id);
                for(var i = start + 1; i <= end; i++){
                    update_id_data(i);
                }
            }
            else{
                console.log("No need update: " + web_max_id);
            }
        })
    });

    newreq.end();
}

function get_item_from_html(html){
    var item = new Array();
    var str_start = html.indexOf("td_title01", 0);
    if(index_start < 0){
        return null;
    }
    var id_str = html.substr(str_start, 128);
    var index_start = id_str.indexOf("<strong>", 0);
    if(index_start < 0){
        return null;
    }
    id_str = id_str.substr(index_start + 8, 5);
    item[0] = id_str;

    index_start = html.indexOf("ball_box01", str_start);
    if(index_start < 0){
        return null;
    }

    var ball_start = html.indexOf("ball_red", index_start);
    var ball_end = html.indexOf("ball_blue", index_start);
    if(ball_start < 0 || ball_end < 0){
        return null;
    }

    var balls_lines = html.substr(ball_start, ball_end + 16 - ball_start);
    var lines = balls_lines.split("\n");
    if(lines.length != 7){
        return null;
    }

    var itemid = 1;
    for(lid in lines){
        var index = lines[lid].indexOf("\">");
        item[itemid ++] = lines[lid].substr(index + 2, 2);
    }

    var sales_index = html.indexOf("cfont1", ball_end);
    if(sales_index < 0){
        return null;
    }

    sales_index = html.indexOf(">", sales_index);
    var xx = html.substr(sales_index, 48);
    var sales_end = html.indexOf("<", sales_index);
    var xx2 = html.substr(sales_end, 48);
    var sales = html.substr(sales_index + 1, sales_end - sales_index - 2);
    sales = sales.replace(/,/g, "");
    item.push(sales);

    var first = html.indexOf("td_title02", sales_end);
    first = html.indexOf("center", first);
    if(first < 0){
        return null;
    }
    first -= 12;
    var money_str = html.substr(first, 512);

    var moneys = money_str.split("<tr");
    var money_count = 0;
    for(id in moneys){
        moneys[id] = moneys[id].replace(/\r/g, "");
        moneys[id] = moneys[id].replace(/\n/g, "");
        moneys[id] = moneys[id].replace(/\t/g, "");
        var tds = moneys[id].split("<td");
        if(tds.length != 4){
            continue;
        }

        var count_index_start = tds[2].indexOf(">", 0);
        var count_index_end = tds[2].indexOf("<", 0);
        var count = tds[2].substr(count_index_start + 1, count_index_end - count_index_start - 1);

        var val_index_start = tds[3].indexOf(">", 0);
        var val_index_end = tds[3].indexOf("<", 0);
        var val = tds[3].substr(val_index_start + 1,  val_index_end - val_index_start - 1);
        val = val.replace(/,/g, "");

        item.push(count);
        item.push(val);
        money_count ++;
        if(money_count == 3){
            break;
        }
    }

    return item;
}

function update_item_to_db(item){
    var sql = "insert into dbcb(id,r1,r2,r3,r4,r5,r6,blue," +
        "sale,first_count,first_reward, second_count,second_reward,third_count,third_reward) values(";

    item[0] = "20" + item[0];
    for(id in item){
        sql += item[id];
        sql += ","
    }
    sql = sql.substr(0, sql.length - 1);
    sql += ")";
    //console.log(sql);

    if(!mysqlcli.connected){
        mysqlcli = new mysql();
        mysql_init();
    }

    mysqlcli.query(sql, function selectCb(err, results, fields) {
        if (err) {
            throw err;
        }

        get_next_update_date();
        mysqlcli.end();
        console.log("Update: " + item[0] + " success");
    });
}

function update_id_data(id){
    web_options.host = 'kaijiang.500wan.com';
    web_options.path =  '/shtml/ssq/' + id.toString() + ".shtml";
    web_options.method =  'GET';

    var newreq = http.request(web_options, function(res) {
        var html = "";
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            html += chunk;
        });

        res.on('end', function () {
            var item = get_item_from_html(html);
            if(item != null){
                update_item_to_db(item);
            }
            else{
                cosole.log("get_item_from_html failed")
            }
        })
    });

    newreq.end();
}

function get_next_update_date(){
    var curDate = new Date();
    var day = curDate.getDay();

    switch(day){
        case 0:
        case 1:
            day = 2;
            break;
        case 2:
        case 3:
            day = 4;
            break;
        case 4:
        case 5:
        case 6:
            day = 0;
            break;
    }

    next_update_day = day;
    console.log("next_update_day: " + next_update_day);
    return day;
}

function main(){
    var curDate = new Date();
    var nextDate = new Date();
    var day = curDate.getDay();

    if(day != next_update_day){
        sleepTime = 60 * 60;
    }
    else{
        sleepTime = 60;
        nextDate.setHours(21, 30);
        if(curDate >= nextDate){
            update_local_data();
        }
    }

    console.log("next_update_day: " + next_update_day);
    console.log("sleepTime: " + sleepTime);

    setTimeout(main, sleepTime * 1000);
}

mysql_init();

get_next_update_date();

//执行第一次更新
update_local_data();

//执行循环更新
main();
