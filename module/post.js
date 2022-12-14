const mongoose =require("mongoose");


const Schema = mongoose.Schema;
const ObjectId=Schema.ObjectId;
const postSchema = new Schema({

    title : {type : String},
    body: {type:String},
    image: {type:String},
    user: { type: ObjectId , ref:"User"}
})

const Post = mongoose.model('Post' , postSchema)


module.exports = Post ;