const { default: mongoose } = require('mongoose');
const { createCustomError } = require('../errors/customAPIError');
const { sendSuccessApiResponse } = require('../middleware/successApiResponse');
const User = require('../model/User');
const WebsiteMaster = require('../model/WebsiteMaster');

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
            DesktopSS,
            MobileSS,
            Colors,
            FontFamily,
            Type,
            Categorys,
            Tags,
            AssociatedPages,
            pageURL,
            Category,
            SubCategory,
        } = req.body
        const step = req.query.step;
        console.log(step)
        const website = await WebsiteMaster.findById(mongoose.Types.ObjectId(id));
        console.log(website)
        if(!website){
            return next(createCustomError("Not Found",404))
        }
        // if(website.Addedby != req.user.userId ){
        //     return next(createCustomError("Cannot Update other's website",404))
        // }
        switch (step) {
            case "2":
                await WebsiteMaster.findByIdAndUpdate(id,{
                    Type:Type,
                })
                break;
            case "3":
                await WebsiteMaster.findByIdAndUpdate(id,{
                    Categorys:Categorys,
                })
                break;
            case "4":
                await WebsiteMaster.findByIdAndUpdate(id,{
                    Tags:Tags,
                })
                break;
            case "5":
                await WebsiteMaster.findByIdAndUpdate(id,{
                    AssociatedPages:AssociatedPages,
                })
                break;
            case "6":
                pageURL = JSON.parse(pageURL)
                Category = JSON.parse(Category)
                SubCategory = JSON.parse(SubCategory)
                let filename = req.files;
                if(filename.DesktopSS){
                    for(let i = 0; i<filename.DesktopSS.length ;i++){
                        const toAdd = {
                            pageURL:pageURL[i],
                            Category:Category[i],
                            SubCategory:SubCategory[i],
                            DesktopSS:"/public/WebsiteSS/"+filename.DesktopSS[i].originalname,
                            MobileSS:"/public/WebsiteSS/"+filename.MobileSS[i].originalname
                        }
                        website.AssociatedComponent.push(toAdd)
                        website.step6 = true;
                        await website.save()
                    }
                }
                const isUser = await User.findById(req.user.userId);
                isUser.Websites.push(website._id);
                website.Addedby = req.user.userId;
                await isUser.save();
                await website.save();
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