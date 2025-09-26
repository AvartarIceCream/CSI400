const express = require('express');
const router = express.Router();

const sql = require('../../db/sql');

router.post('/report', (req, res) => {
    try {
        const {detail, author} = req.body
        sql.query('INSERT INTO week4_1 (detail, author, status) VALUES (?, ?, "pending")', [detail, author], (err, result) => {
            if (err) throw err;
            res.status(200).json("Report was sent");
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/report', (req, res) => {
    try {
        sql.query('SELECT * FROM week4_1', [], (err, result) => {
            if (err) throw err;
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/report/:author', (req, res) => {
    try {
        const { author } = req.params;
        sql.query('SELECT * FROM week4_1 WHERE author = ?', [author], (err, result) => {
            if (err) throw err;
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;