const env = process.env.NODE_ENV || 'development';
console.log('env *****',env);

if (env === 'development'){
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {ObjectID,Todo, User} = require('./models');

var app = express();
const port = process.env.PORT;

// Configure bodyParser middleware
app.use(bodyParser.json());


// Add a new todo
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

// Get all todos
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

app.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};