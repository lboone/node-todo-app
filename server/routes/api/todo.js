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
    apiTodo.post('/',authenticate,(req,res)=>{
        var todo = new Todo({
            text: req.body.text,
            _creator: req.user._id
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
    apiTodo.get('/',authenticate,(req,res)=>{
        Todo.find({
            _creator: req.user._id
        }).then((todos)=>{
            res.send({todos});
        },(err)=>{
            res.status(400).send(err);
        });
    });

    // Route: /todos/:id
    // Parameters
    // id: required
    apiTodo.get('/:id',authenticate,(req,res)=>{
        var id = req.params.id;
        if(ObjectID.isValid(id)){
            Todo.findOne({
                _id: id,
                _creator: req.user._id
            }).then((todo)=>{
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
    apiTodo.delete('/:id',authenticate,(req,res)=>{
        var id = req.params.id;
        if(ObjectID.isValid(id)){
            Todo.findOneAndDelete({
                _id:id,
                _creator: req.user._id
            }).then((todo)=>{
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
    apiTodo.patch('/:id',authenticate,(req,res)=>{
        var id = req.params.id;
        if(ObjectID.isValid(id)){
            var body = _.pick(req.body, ['text','completed']);
            
            if(_.isBoolean(body.completed) && body.completed){
                body.completedAt = new Date().getTime();
            } else {
                body.completed = false;
                body.completedAt = null;
            }
            Todo.findOneAndUpdate({
                _id: id,
                _creator: req.user._id
            },{$set:body},{new: true}).then((todo) => {
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