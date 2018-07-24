const expect = require('expect');
const request = require('supertest');

var {app} = require('./../server');
const {ObjectID, Todo, User} = require('./../models');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('GET /todos', () => {
    it('should get all todos',(done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    })
});
describe('POST /todos', ()=>{
    it('should create a new todo',(done) => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err)=> done(err));
            });
    });

    it('should not create todo with invalid body data',(done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err) {
                return done(err);
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((err) => done(err));
        })
    });
});

describe('GET /todos/:id',()=>{
    it('should return todo doc',(done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);

    });
    
    it('should return 404 if todo not found',(done) => {
        var id = new ObjectID();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids',(done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});


describe('DELETE /todos/:id',()=>{
    it('should delete and return todo doc',(done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeFalsy();
                    done();
                }).catch((err)=> done(err));
            });

    });
    
    it('should return 404 if todo not found',(done) => {
        var id = new ObjectID();
        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids',(done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id',() => {
    it('should update the todo',(done) => {
        var id = todos[0]._id.toHexString();
        var newText = 'New text on update';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: newText,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(newText);
                expect(res.body.completed).toBe(false);
                expect(res.body.completedAt).toBeFalsy();
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed.',(done) => {
        var id = todos[1]._id.toHexString();
        var newText = 'New text on update';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: newText,
                completed: true
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(newText);
                expect(res.body.completed).toBe(true);
                expect(typeof res.body.completedAt).toBe('number');
            })
            .end(done);
    });
});

describe('GET /users/me', () =>{
    it('should return user is authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.user._id).toBe(users[0]._id.toHexString());
                expect(res.body.user.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body['Error']).toBeTruthy();
            })
            .end(done);
    });
});

describe('POST /users',() => {
    it('should create a user',(done) => {
        var email = 'example@example.com';
        var password = '123mnb!1234';
        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.user._id).toBeTruthy();
                expect(res.body.user.email).toBe(email);
            })
            .end((err) => {
                if(err){
                    return done(err);
                }
                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password === password).toBeFalsy();
                    done();
                });
            });
    });
    it('should return validation errors if request invalid', (done) => {
        var email = 'example';
        var password = '123mnb!';
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .expect((res) => {
                expect(res.body['errors']['email']).toBeTruthy();
                expect(res.body['errors']['password']).toBeTruthy();
            })
            .end(done);
    });
    it('should not create user if email in use', (done) => {
        var email = users[0].email;
        var password = '123mnb!1234';
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .expect((res) => {
                expect(res.body['name'] == 'MongoError').toBeTruthy();
            })
            .end(done);
    });
});