const express = require('express');
const router = express.Router();
const sql = require('../../db/sql');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../../middleware/authMiddleware');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


sql.query('SELECT * FROM week6_user', [], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
        sql.query('INSERT INTO week6_user (username, password, role) VALUES (?, ?, ?)', ['admin', bcrypt.hashSync('admin', 8), 'admin'], (err, result) => {
            if (err) throw err;
            console.log('Admin user created');
        });
    }
});   


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

router.get('/getAsset/:username', authenticateToken, (req, res) => {
    try {
        const { username } = req.params;
        sql.query('SELECT * FROM week6_asset WHERE author = ?', [username], (err, result) => {
            if (err) throw err;
            res.status(200).json({ data: result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getAsset/minimum/:price', authenticateToken, (req, res) => {
    try {
        const { price } = req.params;
        sql.query('SELECT * FROM week6_asset WHERE price >= ?', [price], (err, result) => {
            if (err) throw err;
            res.status(200).json({ data: result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getAsset/category/:ctg', authenticateToken, (req, res) => {
    try {
        const { ctg } = req.params;
        sql.query('SELECT * FROM week6_asset WHERE category = ?', [ctg], (err, result) => {
            if (err) throw err;
            res.status(200).json({ data: result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getAsset/category/:ctg/:type', authenticateToken, (req, res) => {
    try {
        const { ctg, type } = req.params;
        sql.query('SELECT * FROM week6_asset WHERE category = ? AND type = ?', [ctg,type], (err, result) => {
            if (err) throw err;
            res.status(200).json({ data: result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;