const express = require('express');
const {sequelize, User} = require("./models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

var corsOptions = {
    origin: '*',
    optionSuccessStatus: 200
}

app.use(express.json())
app.use(cors(corsOptions));

app.post('/register', (req, res) => {
    const obj = {
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        mobile_phone: req.body.mobile_phone,
        role_id: req.body.role_id,
        location_id: req.body.location_id
    };

    User.create(obj).then(rows => {
        const user = {
            userId: rows.id,
            user: rows.username
        };

        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

        console.log(token);

        res.json({token: token});
    }).catch(err => res.status(500).json(err));
});

app.post('/login', (req, res) => {
    User.findOne({where: {username: req.body.username}})
        .then(user => {
            if(bcrypt.compareSync(req.body.password, user.password)){
                const obj = {
                    userId: user.id,
                    user: user.username
                };

                const token = jwt.sign(obj, process.env.ACCESS_TOKEN_SECRET);

                res.json({token: token});
            }else{
                res.status(400).json({msg: "Invalid credentials"});
            }
        }).catch(err => res.status(500).json(err));
});

app.listen({port:9000}, async () => {
    await sequelize.authenticate();
});