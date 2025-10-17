const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let users = [];
let idCounter = 1;

// ---------------------- LOGIN ---------------------- //
app.post('/login', (req, res) => {
    res.status(200).json({ token: 'dummy-token' });
});

// ---------------------- USERS ---------------------- //
app.get('/users', (req, res) => res.status(200).json(users));

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    const newUser = { id: idCounter++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(user);
});

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    res.status(200).json(user);
});

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    users = users.filter(u => u.id !== id);
    res.status(200).json({ message: 'Deleted' });
});


module.exports = app;
