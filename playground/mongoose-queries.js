const {ObjectID, User} = require('./../server/models');

var id = '5b540f1555d101767cbb004b-'
if(ObjectID.isValid(id)){
    User.findById(id).then((user)=>{
        if(!user){
            console.log('ID not found!');
        } else {
            console.log(JSON.stringify(user,undefined,2));
        }
    }).catch((e) => console.log(e));
} else {
    console.log('ID not valid!');
}


// var id = '5b5409c075754274e12e24f2-';

// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }
// Todo.find({
//     _id: id
// }).then((todos)=> {
//     if(todos.length > 0){
//         console.log(JSON.stringify(todos,undefined,2));
//     } else {
//         console.log('ID not found!');
//     }
    
// });

// Todo.findOne({
//     _id: id
// }).then((todo)=> {
//     if(!todo){
//         console.log('ID not found!');
//     } else {
//         console.log(JSON.stringify(todo,undefined,2));
//     }
    
// });

