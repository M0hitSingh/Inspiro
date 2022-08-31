const  mongoose = require('mongoose')
const schema = mongoose.Schema;

const FrameworkMasterSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            unique:true,
            trim: true,
        },
        Addedby: {
            type:schema.Types.ObjectId,
            ref:"User"
        },
        Websites:[{
            type:schema.Types.ObjectId,
            ref:"WebsiteMaster"
        }],
        createdAt: {
            type: Date, 
            default: Date.now(),
        },
    },
    
);

module.exports = mongoose.model("Framework", FrameworkMasterSchema, "Framework");
