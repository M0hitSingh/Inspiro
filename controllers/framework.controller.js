const { createCustomError } = require("../errors/customAPIError")
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");
const FrameworkMaster = require("../model/FrameworkMaster");

const getAllFramework = async(req ,res, next)=>{
    try{
        const Framework =await FrameworkMaster.find().populate("Addedby")
        const response = sendSuccessApiResponse(Framework)
        res.status(200).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
};

const AddFramework = async(req ,res, next)=>{
    try{
        const Addedby = req.user.userId
        const Framework = req.body.Name;
        const isFramework =await FrameworkMaster.findOne({Name:Framework});
        if(isFramework){
            const message = "Framework Already Exist";
            return next(createCustomError(message, 301));
        }
        const doc = new FrameworkMaster({
            Name:Framework,
            Addedby:Addedby
        })
        await doc.save();
        const response = sendSuccessApiResponse(doc)
        res.status(200).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
};

const UpdateFramework = async(req , res ,next)=>{
    try{
        const id = req.body.Id
        const Name = req.body.Name;
        const result = await FrameworkMaster.findById(id);
        if(!result){
            const message = "Not Found";
            return next(createCustomError(message, 404));
        }
        result.Name = Name;
        result.save();
        const response = sendSuccessApiResponse(result);
        res.status(201).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
}
const DeleteFramework = async(req , res ,next)=>{
    try{
        const id = req.body.Id
        const result = await FrameworkMaster.findByIdAndDelete(id);
        if(!result){
            const message = "Not Found";
            return next(createCustomError(message, 404));
        }
        const response = sendSuccessApiResponse(result);
        res.status(201).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
}

module.exports =  {getAllFramework, AddFramework ,UpdateFramework,DeleteFramework}