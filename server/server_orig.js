require('./config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {ObjectID,Todo, User} = require('./models');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

// Configure bodyParser middleware
app.use(bodyParser.json());


// All the todo routes
app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((todo) => {
        res.send({todo});
    }, (e) => {
        
        res.status(400).send(e);
    });
});
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(err);
    });
});
app.get('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(ObjectID.isValid(id)){
        Todo.findById(id).then((todo)=>{
            if(!todo){
                res.status(404).send({'Error':'Todo not found!'});
            } else {
                res.send({todo});
            }
        }).catch((error) => res.status(400).send({'Error':error}));
    } else {
        res.status(404).send({'Error':'ID not valid!'});
    }
});
app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(ObjectID.isValid(id)){
        Todo.findByIdAndDelete(id).then((todo)=>{
            if(!todo){
                res.status(404).send({'Error':'Todo not found!'});
            } else {
                res.send({todo});
            }
        }).catch((error) => res.status(400).send({'Error':error}));
    } else {
        res.status(404).send({'Error':'ID not valid!'});
    }
});
app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    if(ObjectID.isValid(id)){
        var body = _.pick(req.body, ['text','completed']);
        
        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id,{$set:body},{new: true}).then((todo) => {
            if(!todo){
                return res.status(404).send({'Error':'Todo does not exist'});
            }
            res.send((todo));
        }).catch((e) => res.status(400).send());
    } else {
        return res.status(404).send({'Error':'ID not valid!'});
    }
});

// All the user routes
// Signup
app.post('/users',(req,res)=>{
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


// User Profile
app.get('/users/me',authenticate, (req,res)=>{
    var user = req.user;
    res.send({user});
});

app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send({user})
        });
    }).catch((e) => {
        res.status(400).send({'Error':'A user with that email and password does not exist'});
    });
});

app.delete('/users/me/token',authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send({'Success':'You have successfully removed the token'});
    }, (e) => {
       res.status(400).send({'Error':e}); 
    });
});

// Start the server
app.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};