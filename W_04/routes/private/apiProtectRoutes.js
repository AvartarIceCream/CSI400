const express = require('express');
const router = express.Router();
const sql = require('../../db/sql');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../../middleware/authMiddleware');

sql.query('SELECT * FROM week4', [], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
        sql.query('INSERT INTO week4 (username, password, role, created_at) VALUES (?, ?, ?, ?)', ['admin', bcrypt.hashSync('admin', 8), 'admin', new Date()], (err, result) => {
            if (err) throw err;
            console.log('Admin user created');
        });
    }
});  

router.get('/report', authenticateToken, (req, res) => {
    try {
        sql.query('SELECT * FROM week4_1', [], (err, result) => {
            if (err) throw err;
            res.status(200).json({ data: result[0] });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.patch('/report/:id', authenticateToken, (req, res) => {
    try {
        const id = req.params.id;
        sql.query('UPDATE week4_1 SET status = ? WHERE report_id = ?', ["Done", id], (err, result) => {
            if (err) throw err;
            res.status(200).json({ message: 'Report updated successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

router.get('/user', authenticateToken, (req, res) => {
    try {
        sql.query('SELECT user_id, username, role, created_at FROM week4', [], (err, result) => {
            if (err) throw err;
            res.status(200).json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/user/:id', authenticateToken, (req, res) => {
    try {
        const password = req.body.password;
        const role = req.body.role;

        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

        sql.query('UPDATE week4 SET password = ? , role = ? WHERE user_id = ?', [bcrypt.hashSync(password, 8), role, req.params.id], (err, result) => {
            if (err) throw err;
            res.status(200).json({ message: 'Password updated successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/user/:id', authenticateToken, (req, res) => {
    try {
        const id = req.params.id;
        if (req.user.role !== 'admin') return res.status(403).json({ message: 'Unauthorized' });

        sql.query('DELETE FROM week4 WHERE user_id = ?', [id], (err, result) => {
            if (err) throw err;
            res.status(200).json({ message: 'User deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;