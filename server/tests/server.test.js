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
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    })
});
describe('POST /todos',()=>{
    it('should create a new todo',(done) => {
        var text = 'Test todo text';
        var _creator = users[0]._id;
        request(app)
            .post('/todos')
            .send({text,_creator})
            .set('x-auth',users[0].tokens[0].token)
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
        .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);

    });
    
    it('should return 404 if todo not found',(done) => {
        var id = new ObjectID();
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids',(done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    it('should not return a todo doc if created by other user',(done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .expect(404)
            .set('x-auth',users[0].tokens[0].token)
            .end(done);

    });
});
describe('DELETE /todos/:id',()=>{
    it('should delete and return todo doc',(done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .set('x-auth',users[0].tokens[0].token)
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
    
    it('should not delete and return todo doc',(done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .set('x-auth',users[0].tokens[0].token)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBeTruthy();
                    done();
                }).catch((err)=> done(err));
            });

    });
    it('should return 404 if todo not found',(done) => {
        var id = new ObjectID();
        request(app)
            .delete(`/todos/${id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non object ids',(done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(newText);
                expect(res.body.completed).toBe(false);
                expect(res.body.completedAt).toBeFalsy();
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed.',(done) => {
        var id = todos[0]._id.toHexString();
        var newText = 'New text on update';
        request(app)
            .patch(`/todos/${id}`)
            .send({
                text: newText,
                completed: true
            })
            .set('x-auth',users[0].tokens[0].token)
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
                }).catch((e) => done(e));
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
describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        var email = users[1].email;
        var password = users[1].password;
        request(app)
            .post('/users/login')
            .send({email,password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject invalid login', (done) => {
        var email = users[1].email + '1';
        var password = users[1].password + '1';
        request(app)
            .post('/users/login')
            .send({email,password})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});
describe('DELETE /users/me/token',() => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth',users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});