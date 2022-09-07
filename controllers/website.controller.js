const { default: mongoose, Mongoose } = require('mongoose');
const { createCustomError } = require('../errors/customAPIError');
const { sendSuccessApiResponse } = require('../middleware/successApiResponse');
const TypeMaster = require('../model/TypeMaster');
const User = require('../model/User');
const WebsiteMaster = require('../model/WebsiteMaster');
const FrameworkMaster = require('../model/FrameworkMaster')
const Category = require("../model/categoryMaster")
const Tag = require("../model/TagMaster")
// const CategoryMaster = require('../model/CategoryMaster')


const addWebsite = async(req, res, next)=>{
    try{
        const {
            url,
            Colors,
            FontFamily,
        } = req.body
        const isWebsite = await WebsiteMaster.findOne({url:url});
        // console.log(isWebsite)
        if(isWebsite){
            const result = await User.find({_id:req.user.userId,Websites:mongoose.Types.ObjectId(isWebsite._id)});
            console.log(result)
            if(result.length) return res.json("This user");
            else  return  next(createCustomError("Website Already Exist",400));
        }
        const website = await WebsiteMaster.create({url:url})
        let filename = req.files;
        if(filename.DesktopSS){
            for(let i = 0; i<filename.DesktopSS.length ;i++){
                website.DesktopSS.push("/public/WebsiteSS/"+filename.DesktopSS[i].originalname)
            }
        }
        if(filename.MobileSS){
            for(let i = 0; i<filename.MobileSS.length ;i++){
                website.MobileSS.push("/public/WebsiteSS/"+filename.MobileSS[i].originalname)
            }
        }
        website.step1 = true;
        website.Colors = Colors;
        website.FontFamily = FontFamily;
        const isUser = await User.findById(req.user.userId);
        isUser.Websites.push(website._id);
        website.Addedby = req.user.userId;
        await isUser.save();
        await website.save()
        // await isUser.save()
        res.json(website)
    }
    catch(err){
        next(createCustomError(err,400));
    }
}
const updateWebsite = async (req, res, next)=>{
    try{
        let {
            id,
            url,
            DesktopSSLength,
            MobileSSLength,
            Colors,
            FontFamily,
            MarketplaceLink,
            Price,
            Framework,
            Type,
            Categorys,
            Tags,
            AssociatedPages,
            pageURL,
            MyCategory,
            SubCategory,
        } = req.body
        const step = req.query.step;
        console.log(step)
        const website = await WebsiteMaster.findById(mongoose.Types.ObjectId(id));
        // console.log(website)
        if(!website){
            return next(createCustomError("Not Found",404))
        }
        if(website.Addedby.toString() != req.user.userId.toString() ){
            return next(createCustomError("Cannot Update other's website",404))
        }
        switch (step) {
            case "2":
                await WebsiteMaster.findByIdAndUpdate(id,{
                    Type:Type,
                    Framework:Framework,
                    MarketplaceLink:MarketplaceLink,
                    Price:Price
                })
                const isType =await TypeMaster.findOne({_id:Type.id,Websites:id})
                if(!isType) await TypeMaster.findOneAndUpdate({_id:Type.id},{$push:{Websites:id}})
                if(Framework){
                    const isFrame = await FrameworkMaster.findOne({_id:Framework.id,Websites:id})
                    if(isFrame) await FrameworkMaster.findOneAndUpdate({_id:Framework.id},{$push:{Websites:id}})
                }
                break;
            case "3":
                await WebsiteMaster.findByIdAndUpdate(id,{
                    Categorys:Categorys,
                })
                for(let i = 0; i < Categorys.length ; i++){
                    const isCategory = await Category.findOne({_id:Categorys[i].id,Websites:id})
                    if(!isCategory) await Category.findOneAndUpdate({_id:Categorys[i].id},{$push:{Websites:id}})
                }
                break;
            case "4":
                await WebsiteMaster.findByIdAndUpdate(id,{
                    Tags:Tags,
                })
                for(let i = 0; i < Tags.length ; i++){
                    const isTag = await Tag.findOne({_id:Tags[i].id,Websites:id})
                    if(!isTag) await Tag.findOneAndUpdate({_id:Tags[i].id},{$push:{Websites:id}})
                }
                break;
            case "5":
                console.log(AssociatedPages)
                await WebsiteMaster.findByIdAndUpdate(id,{
                    AssociatedPages:AssociatedPages,
                })
                break;
            case "6":
                DesktopSSLength = JSON.parse( DesktopSSLength);
                MobileSSLength =JSON.parse(MobileSSLength )
                pageURL = JSON.parse(pageURL)
                MyCategory = JSON.parse(MyCategory)
                SubCategory = JSON.parse(SubCategory)
                let filename = req.files;
                console.log(filename)
                if(filename.DesktopSS){
                    console.log(DesktopSSLength)
                    for(let i = 0; i<DesktopSSLength.length ;i=i+2){
                        const Desktopchunk =[];
                        const Mobilechunk = [];
                        console.log(DesktopSSLength[i])
                        console.log(DesktopSSLength[i+1])
                        for(let j = DesktopSSLength[i];j < DesktopSSLength[i+1] ;j++){
                            Desktopchunk.push("/public/WebsiteSS/"+filename.DesktopSS[j].originalname)
                        }
                        for(let j = MobileSSLength[i];j < MobileSSLength[i+1] ;j++){
                            Mobilechunk.push("/public/WebsiteSS/"+filename.MobileSS[j].originalname)
                        }

                        const toAdd = {
                            pageURL:pageURL[i],
                            Category:MyCategory[i],
                            SubCategory:SubCategory[i],
                            DesktopSS:Desktopchunk,
                            MobileSS:Mobilechunk
                        }
                        website.AssociatedComponent.push(toAdd)
                        await website.save()
                    }
                }
                break;
            default:
                return next(createCustomError("Step Not defined",400));
        }
        const response = sendSuccessApiResponse(`Updated Step${step}`)
        res.status(200).json(response);
    }
    catch(err){
        console.log(err)
        next(createCustomError(err,400));
    }
}

const getWebsite = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const website = await WebsiteMaster.findById(id)
        if(!website){
            return next(createCustomError("Not Found",404));
        }
        const response = sendSuccessApiResponse(website);
        res.status(200).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
}

const softdeleteWebsite = async (req, res, next)=>{
    try{
        const id = req.params.id;
        const website = await WebsiteMaster.findById(id);
        if(!website){
            return next(createCustomError("Not Found",404))
        }
        if(website.Addedby.toString() != (req.user.userId) ){
            return next(createCustomError("Cannot Delete other's website",401))
        }
        website.isActive = false;
        await website.save();
        await User.updateOne({_id:req.user.userId},{$pull:{Websites:id}})
        const response = sendSuccessApiResponse("Soft Deleted")
        res.status(200).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
}

module.exports = {addWebsite, updateWebsite ,getWebsite , softdeleteWebsite}