var express = require('express');
var mysql = require('mysql');
// var NodeSession = require('node-session');
var qs = require('querystring');
var bodyParser = require('body-parser');
var passwordHash = require('password-hash');
var session = require('express-session');
var url = require('url');
var route = require('routes')();
var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// var session = new NodeSession({
//     secret: 'Q3UBzdH9GEfiRCTKbi5MTPyChpzXLsTD'
// });

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'pug');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'nodedb'
});

con.connect(function(err){
    if (err) throw err;
    console.log("connected");
});

app.get('/', function(request, res) {
    res.render('index');
});

app.get('/about', function(request,res){
    res.render('admin/test');
});
// delete data

app.get('/delete_admin', function(request,res){
    var id = qs.parse(url.parse(request.url).query).id;
    var admin = "DELETE FROM admin WHERE id = ?";
    var user = "DELETE FROM user WHERE id = ?";
    con.query(admin, [id], function(err, results){
        con.query(user, [id], function(err, results){
            if (err) throw err;
            res.redirect('/admin');
            console.log('data berhasil dihapus' + id);
            res.end();
        });
    });
});

app.get('/delete_siswaMM', function(request,response){
    var id = qs.parse(url.parse(request.url).query).id;
    var siswa = "DELETE FROM siswa_multimedia WHERE id = ?";
    var user = "DELETE FROM user WHERE id = ?";
    con.query(siswa, [id], function(err, results){
        con.query(user, [id], function(err, results){
            if (err) throw err;
            response.redirect('/admin');
            console.log('data berhasil dihapus' + id);
            response.end();
        });
    });
});

app.get('/delete_siswa_teknik', function(request,response){
    var id = qs.parse(url.parse(request.url).query).id;
    var siswa = "DELETE FROM siswa_teknik WHERE id = ?";
    var user = "DELETE FROM user WHERE id = ?";
    con.query(siswa, [id], function(err, results){
        con.query(user, [id], function(err, results){
            if (err) throw err;
            response.redirect('/admin');
            console.log('data berhasil dihapus' + id);
            response.end();
        });
    });
});

app.get('/contact', function(request,response){
    con.query("SELECT * FROM siswa_multimedia", function(err, results, field){
        if (err) throw err;
        response.render('contact', {siswa: results});
    });
});

app.get('/admin', function(request,response){
    var username = username;
    var password = password;
    con.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, passwordHash.isHashed(password)], function(error, results, fields) {
        if (request.session.loggedin) {
            request.session.loggedin = true;
            request.session.username = username;
            con.query("SELECT * FROM admin", function(err, results_admin, field){
                con.query("SELECT * FROM siswa_multimedia", function(err, results_siswaMM, field){
                    con.query("SELECT * FROM siswa_teknik", function(err, results_siswaTeknik, field){
                        if (err) throw err;
                        response.render('admin', {siswa_MM: results_siswaMM, admin: results_admin, siswa_teknik: results_siswaTeknik});
                    });   
                });   
            });   
            console.log(request.session); 
        } else {
            response.redirect('/login')
            response.end();  
        }	
    });
    
});

app.get('/login', function(request,response){
    response.render('login');
});


// Authentication
app.post('/login', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, passwordHash.isHashed(password)], function(error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                if (results[0]['level'] === 'admin') {
                    response.redirect('/admin');
                    console.log(results[0]['nama'] + ' telah login');
                } else  if(results[0]['level'] === 'siswa') {
                    response.redirect('/');
                    console.log(results[0]['nama'] + ' telah login');
                }
            } else {
                response.send('Incorrect Username and/or Password!');
            }			
            response.end();  
		});
	} else {
		response.end();
	}
});

app.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

// Inserting Data

app.post('/tambahDataAdmin', function(request,response) {
    var id;
    var nama = request.body.nama;
    var jenis_kelamin = request.body.jenis_kelamin;
    var umur = request.body.umur;
    var alamat = request.body.alamat;
    var photoProfile = request.body.photoProfile;
    var data_admin = [id, nama, jenis_kelamin, umur, alamat, photoProfile];

    var id;
    var username = request.body.username;
    var password = passwordHash.generate(request.body.password);
    var level = request.body.level;
    var nama = request.body.nama;
    var data_user = [id, username, password, level, nama];

    console.log(data_admin);
    console.log(data_user);

    var admin = "INSERT INTO admin VALUES (?,?,?,?,?,?)";
    var user = "INSERT INTO user VALUES (?,?,?,?,?)";
    con.query(admin, data_admin, function(error, results) {
        con.query(user, data_user, function(error, results){
            if(error) throw error;
            response.redirect('/admin');
            response.end();
        });    
    });
});

app.post('/tambahDataSiswaMM', function(request,response) {
    var id;
    var nama = request.body.nama;
    var NIS = request.body.NIS;
    var jenis_kelamin = request.body.jenis_kelamin;
    var umur = request.body.umur;
    var alamat = request.body.alamat;
    var photoProfile = request.body.photoProfile;
    var data_siswa = [id, nama, NIS, jenis_kelamin, umur, alamat, photoProfile];

    var id;
    var username = request.body.username;
    var password = passwordHash.generate(request.body.password);
    var level = request.body.level;
    var nama = request.body.nama;
    var data_user = [id, username, password, level, nama];

    console.log(data_siswa);
    console.log(data_user);

    var siswa = "INSERT INTO siswa_multimedia VALUES (?,?,?,?,?,?,?)";
    var user = "INSERT INTO user VALUES (?,?,?,?,?)";
    con.query(siswa, data_siswa, function(error, results) {
        con.query(user, data_user, function(error, results){
            if(error) throw error;
            response.redirect('/admin');
            response.end();
        });    
    });
});

app.post('/tambahDataSiswaTeknik', function(request,response) {
    var id;
    var nama = request.body.nama;
    var NIS = request.body.NIS;
    var jenis_kelamin = request.body.jenis_kelamin;
    var umur = request.body.umur;
    var alamat = request.body.alamat;
    var photoProfile = request.body.photoProfile;
    var data_siswa = [id, nama, NIS, jenis_kelamin, umur, alamat, photoProfile];

    var id;
    var username = request.body.username;
    var password = passwordHash.generate(request.body.password);
    var level = request.body.level;
    var nama = request.body.nama;
    var data_user = [id, username, password, level, nama];

    console.log(data_siswa);
    console.log(data_user);

    var siswa = "INSERT INTO siswa_teknik VALUES (?,?,?,?,?,?,?)";
    var user = "INSERT INTO user VALUES (?,?,?,?,?)";
    con.query(siswa, data_siswa, function(error, results) {
        con.query(user, data_user, function(error, results){
            if(error) throw error;
            response.redirect('/admin');
            response.end();
        });    
    });
});



app.listen(3000);
console.log('express jalan.. di port 3000');