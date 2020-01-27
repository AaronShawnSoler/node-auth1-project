const express = require('express');
const db = require('./userDB');
const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());

server.post('/api/register', (req, res) => {
    let user = req.body;

    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash;

    db.addUser(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(error => {
            res.status(500).json(error);
        })
});

server.post('/api/login', (req, res) => {
    let {username, password} = req.body;

    db.getUser(username)
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}`});
            } else {
                res.status(401).json({ message: 'You shall not pass!'});
            }
        })
        .catch(error => {
            res.status(500).json(error);
        })
});

server.get('/api/users', restricted, (req, res) => {
    db.getUsers()
        .then(users => res.send(users));
});

function restricted(req, res, next) {
    let {username, password} = req.headers;

    if(username && password) {
        db.getUser(username)
        .then(user => {
            if(user && bcrypt.compareSync(password, user.password)) {
                next();
            } else {
                res.status(401).json({ message: 'You shall not pass!'});
            }
        })
    } else {
        res.status(400).json({ message: 'provide username and password'})
    }
}

module.exports = server;