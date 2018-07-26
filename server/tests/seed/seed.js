const {ObjectID, Todo, User} = require('./../../models');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'lloyd@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({id: userOneId, access: 'auth'},process.env.JWT_SECRET).toString()
    }]
},{
    _id: userTwoId,
    email: 'melissa@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({id: userTwoId, access: 'auth'},process.env.JWT_SECRET).toString()
    }]
}];

const todos = [
    {
        _id: new ObjectID(), 
        text: 'First test todo',
        _creator: userOneId
    },{
        _id: new ObjectID(), 
        text: 'Second test todo',
        completed: true,
        completedAt: new Date(),
        _creator: userTwoId
    }
];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne,userTwo]);
    }).then(() => done());
}

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
}


module.exports = {todos, populateTodos, users, populateUsers};