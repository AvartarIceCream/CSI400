const express = require('express');
const router = express.Router();
const sql = require('../../db/sql');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../../middleware/authMiddleware');

sql.query('SELECT * FROM week6_user', [], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
        sql.query('INSERT INTO week6_user (username, password, role) VALUES (?, ?, ?)', ['admin', bcrypt.hashSync('admin', 8), 'admin'], (err, result) => {
            if (err) throw err;
            console.log('Admin user created');
        });
    }
});   

router.get('/getAsset', authenticateToken, (req, res) => {
    try {
        sql.query('SELECT * FROM week6_asset', [], (err, result) => {
            if (err) throw err;
            res.status(200).json({ data: result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getAsset/:param', authenticateToken, (req, res) => {
    try {
        sql.query('SELECT * FROM week6_asset', [], (err, result) => {
            if (err) throw err;
            res.status(200).json({ data: result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;