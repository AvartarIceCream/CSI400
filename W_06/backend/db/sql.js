const mysql = require('mysql2');

const sql = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "sun_0990472913",
    database: "csi400"
});

sql.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

module.exports = sql;