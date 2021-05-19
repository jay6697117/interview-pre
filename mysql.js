const express = require('express');
const app = express();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: null,
  port: '3306',
  database: 'zjhdb'
});


connection.connect(err => {
  if (err) throw err;
  console.log('mysql 连接成功');
});

connection.query('SELECT * FROM zjhTable', function (error, results, fields) {
  if (error) throw error;
  console.log('results :>> ', results);
  // console.log('The solution is: ', results[0].solution);
});

app.listen(3000, () => {
  console.log('server is run 3000, please open: http://localhost:3000/');
});
