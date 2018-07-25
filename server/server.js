require('./config');
const port = process.env.PORT;

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const apiTodo = require('./routes/api/todo');
const apiUser = require('./routes/api/user');

app.use(bodyParser.json());
app.use('/todos',apiTodo);
app.use('/users',apiUser);


// Start the server
app.listen(port,() => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};