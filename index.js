
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

const mysqlConnection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_crud'
});

mysqlConnection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
}); 

//set views file
app.set('views',path.join(__dirname,'views'));
			
//set view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//app.use(express.static(__dirname + '/public'));

app.get('/',(req, res) => {
    let sql = "SELECT * FROM users";
    let query = mysqlConnection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            title : 'CRUD Operations',
            users : rows
        });
    });
});

app.get('/add',(req, res) => {
    res.render('addUser', {
        title : 'CRUD Operations',
    });
});
 
app.post('/save',(req, res) => { 
    let data = {name: req.body.name, email: req.body.email, phone_no: req.body.phone_no};
    let sql = "INSERT INTO users SET ?";
    let query = mysqlConnection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});
 
app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = mysqlConnection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'CRUD Operations',
            user : result[0]
        });
    });
});


app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update users SET name='"+req.body.name+"',  email='"+req.body.email+"',  phone_no='"+req.body.phone_no+"' where id ="+userId;
    let query = mysqlConnection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

app.get('/delete/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = mysqlConnection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
});


// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});


