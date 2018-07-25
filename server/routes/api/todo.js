const express = require('express');
const {authenticate} = require('./../../middleware/authenticate');
const _ = require('lodash');
const {ObjectID,Todo} = require('./../../models');


module.exports = (function(){
    'use strict'
    var apiTodo = express();

    // Route: /todos
    // Parameters
    // text: required
    apiTodo.post('/',(req,res)=>{
        var todo = new Todo({
            text: req.body.text
        });
        todo.save().then((todo) => {
            res.send({todo});
        }, (e) => {
            
            res.status(400).send(e);
        });
    });

    // Route: /todos
    // Parameters
    // none
    apiTodo.get('/',(req,res)=>{
        Todo.find().then((todos)=>{
            res.send({todos});
        },(err)=>{
            res.status(400).send(err);
        });
    });

    // Route: /todos/:id
    // Parameters
    // id: required
    apiTodo.get('/:id',(req,res)=>{
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

    // Rooute: /todos/:id
    // Parameters
    // id: required
    apiTodo.delete('/:id',(req,res)=>{
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

    // Route:  /todos/:id
    // Parameters
    // id: required
    // text: optional
    // completed: optional
    apiTodo.patch('/:id',(req,res)=>{
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

    return apiTodo;
})();