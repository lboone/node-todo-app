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
    apiUser.post('/', async (req,res)=>{
        try{
            var body = _.pick(req.body,['email','password']);
            var user = new User(body);
            await user.save();
            const token = await user.generateAuthToken()
            res.header('x-auth', token).send({user})
        } catch(e) {
            res.status(400).send(e);
        }
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
    apiUser.post('/login',async (req,res)=>{
        try {
            const body = _.pick(req.body,['email','password']);
            const user = await User.findByCredentials(body.email,body.password);
            const token = await user.generateAuthToken();
            res.header('x-auth', token).send({user})
        } catch(e) {
            res.status(400).send({'Error':'A user with that email and password does not exist'});
        }
    });

    // Route: /users/me/token (Logout)
    // Parameters:
    // none
    // header: x-auth - auth key
    apiUser.delete('/me/token',authenticate, async (req,res) => {
        
        try {
            await req.user.removeToken(req.token);
        res.status(200).send({'Success':'You have successfully removed the token'});
        } catch(e) {
            res.status(400).send({'Error':e}); 
        }
    });

    return apiUser;
})();