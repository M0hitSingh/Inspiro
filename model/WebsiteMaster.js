const mongoose = require("mongoose")
const schema = mongoose.Schema;

const WebsiteMasterSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            unique:true,
            trim: true,
        }
    }
);

module.exports = mongoose.model("Website", WebsiteMasterSchema, "Website");
