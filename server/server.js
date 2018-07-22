const express = require('express');
const bodyParser = require('body-parser');

var {Todo, User} = require('./models');

var app = express();

// Configure bodyParser middleware
app.use(bodyParser.json());


// Add a new todo
app.post('/todos',(req,res)=>{
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {

        res.send(doc);
    }, (e) => {
        
        res.status(400).send(e);
    });
});



app.listen(3000,() => {
    console.log('Started on port 3000');
});