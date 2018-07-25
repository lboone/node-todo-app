const express = require('express');
const {authenticate} = require('./../../middleware/authenticate');
const _ = require('lodash');
const {User} = require('./../../models');

module.exports = (function(){
    'use strict'
    var apiUser = express();

    // Route: /users (Sign Up)
    // Parameters:
    // email: required
    // password: required
    apiUser.post('/',(req,res)=>{
        var body = _.pick(req.body,['email','password']);
        var user = new User(body);
        user.save().then(()=>{
            return user.generateAuthToken();
        }).then((token) => {
            res.header('x-auth', token).send({user})
        }).catch((e) => {
            res.status(400).send(e);
        });
    });

    // Route: /users/me (User Profile)
    // Parameters:
    // none
    // header: x-auth - auth key
    apiUser.get('/me',authenticate, (req,res)=>{
        var user = req.user;
        res.send({user});
    });

    // Route: /users/login (Login)
    // Parameters:
    // email: required
    // password: required
    apiUser.post('/login',(req,res)=>{
        var body = _.pick(req.body,['email','password']);
        User.findByCredentials(body.email,body.password).then((user) => {
            return user.generateAuthToken().then((token) => {
                res.header('x-auth', token).send({user})
            });
        }).catch((e) => {
            res.status(400).send({'Error':'A user with that email and password does not exist'});
        });
    });

    // Route: /users/me/token (Logout)
    // Parameters:
    // none
    // header: x-auth - auth key
    apiUser.delete('/me/token',authenticate, (req,res) => {
        req.user.removeToken(req.token).then(() => {
            res.status(200).send({'Success':'You have successfully removed the token'});
        }, (e) => {
        res.status(400).send({'Error':e}); 
        });
    });

    return apiUser;
})();