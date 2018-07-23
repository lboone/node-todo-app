const {ObjectID, User,Todo} = require('./../server/models');

// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

// Todo.findOneAndRemove({_id: '5b56000b001cf297d985d58e'}).then((doc)=>{
//     console.log(doc);
// });

Todo.findByIdAndRemove('5b56000b001cf297d985d58e').then((doc)=>{
    console.log(doc);
});