const mongoose = require("mongoose");

const likeSaveSchema = new mongoose.Schema({
    wesiteUrl:{
        type : mongoose.Types.ObjectId
    },
    likeCount:{
        type:Number,
        default:0
    },
    saveCount:{
        type:Number ,
        default:0 
    }
})