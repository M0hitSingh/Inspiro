const mongoose = require("mongoose")
const schema = mongoose.Schema;

const WebsiteMasterSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
            trim: true,
        },
        DesktopSS:[{
            type:String
        }],
        MobileSS:[{
            type:String
        }],
        Colors:[{
            type:String
        }],
        FontFamily:[{
            type:String
        }],
        Type:{
            Name:{
                type:String
            },
            Framework:{
                type:String
            },
            MarketplaceLink:{
                type:String
            }
        },
        Categorys:[{
            type:String
        }],
        Tags:[{
            type:String
        }],
        AssociatedPages:[{
            Name:{
                type:String
            },
            PageLink:{
                type:String
            },
        }],
        AssociatedComponent :[{
            pageURL:{
                type:String
            },
            Category:{
                type:String
            },
            SubCategory:{
                type:String
            },
            DesktopSS:{
                type:String
            },
            MobileSS:{
                type:String
            }
        }],
        Addedby :{
            type:schema.Types.ObjectId,
            ref:"User"
        },
        isActive :{
            type:Boolean,
            default:true
        }
    }
);

module.exports = mongoose.model("Website", WebsiteMasterSchema, "Website");
