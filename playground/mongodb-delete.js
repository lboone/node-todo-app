//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');
//const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client) => {
    if(err){
        return console.log('Error: Unable to coneect to MongoDB server.','Here is the error:\n',err);
    }
    
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result);
    // });
    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result)=>{
    //         console.log(result);
    // });
    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((data)=>{
    //     console.log(data);
    // });

    // db.collection('Users').deleteMany({name: 'Brianna Boone'}).then((result)=>{
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5b50eea83d3fdd4b516731aa')}).then((document)=>{
        console.log(JSON.stringify(document,undefined,2));
    },(err) => {
        console.log('Unable to delete document',err);
    });
    //client.close();
});