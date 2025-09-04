const express = require('express');
const app = express();
const port = 3000;
let users = [];
app.use(express.json()); // middleware to parse JSON


// GET all users
app.get('/users', (req, res) => {
    res.json(users);
});


// POST a new user
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (users.length > 0) {
        newUser.id = users[users.length - 1].id + 1;
    } else {
        newUser.id = users.length + 1;
    }
    users.push(newUser);
    res.status(201).json(newUser);
});


// PUT (update) an existing user
app.put('/users', (req, res) => {
    const userId = parseInt(req.query.id);
    const updatedUser = req.body;

    if (!isNaN(userId)) {
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedUser };
            res.json(users[userIndex]);
        }
    } else {
        const userEmail = req.body.email;
        const userIndex = users.findIndex((user) => user.email === userEmail);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updatedUser };
            res.json(users[userIndex]);
        }else{
            res.status(404).send('User not found');
        }
    }
});


// DELETE a user
app.delete('/users', (req, res) => {
    const userId = parseInt(req.query.id);

    if (!isNaN(userId)) {
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            res.status(204).send(`User with id ${userId} deleted`);
        }
    } else {
        const userEmail = req.body.email;
        const userIndex = users.findIndex((user) => user.email === userEmail);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            res.status(204).send(`User with email ${userEmail} deleted`);
        }else{
            res.status(404).send('User not found');
        }
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});