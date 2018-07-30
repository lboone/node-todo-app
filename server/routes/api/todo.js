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
    apiTodo.post('/',authenticate, async (req,res)=>{
        try{
            var newTodo = new Todo({
                text: req.body.text,
                _creator: req.user._id
            });
            var todo = await newTodo.save();
            res.send({todo});
        } catch(e) {
            res.status(400).send(e);
        }
    });

    // Route: /todos
    // Parameters
    // none
    apiTodo.get('/',authenticate, async (req,res)=>{
        try {
            const todos = await Todo.find({
                _creator: req.user._id
            });
            res.send({todos});
        } catch(e) {
            res.status(400).send(err);
        }
    });

    // Route: /todos/:id
    // Parameters
    // id: required
    apiTodo.get('/:id',authenticate, async (req,res)=>{
        const id = req.params.id;
        if(!ObjectID.isValid(id)){
            return res.status(404).send({'Error':'ID not valid!'}); 
        }
        try {
            const todo = await Todo.findOne({
                _id: id,
                _creator: req.user._id
            });
            if(!todo){
                res.status(404).send({'Error':'Todo not found!'});
            } else {
                res.send({todo});
            }
        } catch (error) {
            res.status(400).send({'Error':error});
        }
    });

    // Rooute: /todos/:id
    // Parameters
    // id: required
    apiTodo.delete('/:id',authenticate,async (req,res)=>{
        var id = req.params.id;
        if(!ObjectID.isValid(id)){
            return res.status(404).send({'Error':'ID not valid!'});
        }
        try {
            const todo = await Todo.findOneAndDelete({
                _id:id,
                _creator: req.user._id
            });
            if(!todo){
                res.status(404).send({'Error':'Todo not found!'});
            } else {
                res.send({todo});
            }
        } catch(error) {
            res.status(400).send({'Error':error});
        }
    });

    // Route:  /todos/:id
    // Parameters
    // id: required
    // text: optional
    // completed: optional
    apiTodo.patch('/:id',authenticate,async (req,res)=>{
        let id = req.params.id;
        if(!ObjectID.isValid(id)){
            return res.status(404).send({'Error':'ID not valid!'});
        }
        let body = _.pick(req.body, ['text','completed']);
        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        } else {
            body.completed = false;
            body.completedAt = null;
        }
        try {   
            const todo = await Todo.findOneAndUpdate({
                _id: id,
                _creator: req.user._id
            },{$set:body},{new: true});
            if(!todo){
                res.status(404).send({'Error':'Todo does not exist'});
            } else {
                res.send((todo));
            }
        } catch(error) {
            res.status(400).send({'Error':error});
        }
    });
    return apiTodo;
})();