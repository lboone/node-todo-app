//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
//const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err){
        return console.log('Error: Unable to coneect to MongoDB server.','Here is the error:\n',err);
    }
    
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5b50f3e916d76e86b9f3f87a')
    // }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err) => {
    //   console.log('Unable to fetch todos',err);  
    // });
    
    // db.collection('Todos').find().count().then((count)=>{
    //     console.log('Todos count:',count);
    // },(err) => {
    //   console.log('Unable to fetch todo count',err);  
    // });

    db.collection('Users').find({name: 'Lloyd Boone'}).toArray().then((docs)=>{
        console.log('Users');
        console.log(JSON.stringify(docs,undefined,2));
    }, (err) => {
        console.log('Unable to fetch users');
    });
    //client.close();
});