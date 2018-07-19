//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient, ObjectID} = require('mongodb');
const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err){
        return console.log('Error: Unable to coneect to MongoDB server.','Here is the error:\n',err);
    }
    
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // },(err, result) => {
    //     if(err) {
    //         return console.log('Error: Unable to insert todo','Here is the error:\n',err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    // Insert new doc into Users (name,age,location)

    // db.collection('Users').insertOne({
    //     name: 'Brianna Boone',
    //     age: 13,
    //     location: 'Zebulon, NC'
    // },(err,result)=>{
    //     if(err){
    //         return console.log('Error: Unable to insert user','Here is the error:\n',err);
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
    // });
    client.close();
});