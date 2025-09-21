const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sql = require('../../db/sql');

require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        sql.query('SELECT * FROM user WHERE username = ?', [username], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }

            const user = result[0];
            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const token = jwt.sign(
                { userId: user.id, username: user.username, role: user.role,  createdAt: user.createdAt },
                SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.json({ token });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', (req, res) => {
    try {
        const { username, password, role} = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        const insertUserQuery = 'INSERT INTO user (username, password, role, createdAt) VALUES (?, ?, ?, ?)';
        const insertUserParams = [username, hashedPassword, role, new Date()];

        sql.query(insertUserQuery, insertUserParams, (err, result) => {
            if (err) throw err;
            res.status(200).json({message : "Created User"})
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    } 
}); 

module.exports = router;