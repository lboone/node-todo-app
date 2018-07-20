//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
//const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err){
        return console.log('Error: Unable to coneect to MongoDB server.','Here is the error:\n',err);
    }
    
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5b5104be16d76e86b9f3fce7')
    // },{
    //     $set: {
    //         completed: true
    //     }
    // },{
    //     returnOriginal: false
    // }).then((document)=>{
    //     console.log(JSON.stringify(document,undefined,2));
    // },(err) => {
    //     console.log('Unable to update document',err);
    // });

    db.collection('Users').findOneAndUpdate({
        name: 'Melissa T Boone'
    },{
        $set: {
            name: 'Melissa Boone'
        },
        $inc: {
            age: -1
        }
    },{
        returnOriginal: false
    }).then((document)=>{
        console.log(JSON.stringify(document,undefined,2));
    },(err) => {
        console.log('Unable to update document',err);
    });
    //client.close();
});