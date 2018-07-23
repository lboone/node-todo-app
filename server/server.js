const express = require('express');
const bodyParser = require('body-parser');

var {ObjectID,Todo, User} = require('./models');

var app = express();

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


app.listen(3000,() => {
    console.log('Started on port 3000');
});

module.exports = {app};