const { createCustomError } = require("../errors/customAPIError");
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");
const Type = require("../model/TypeMaster")

const getAllType  = async(req ,res, next)=>{
    try{
        const types = await Type.find().populate("Addedby")
        const response = sendSuccessApiResponse(types)
        res.status(200).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
}

const AddType = async(req ,res, next)=>{
    try{
        const Addedby = req.user.userId
        const type = req.body.Name;
        const isType = await Type.findOne({Name:type});
        if(isType){
            const message = "Type Already Exist";
            return next(createCustomError(message, 301));
        }
        const doc = new Type({
            Name:type,
            Addedby:Addedby
        })
        await doc.save();
        const response = sendSuccessApiResponse(doc)
        res.status(200).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
}
const UpdateType = async(req , res ,next)=>{
    try{
        const id = req.body.Id
        const Name = req.body.Name;
        const result = await Type.findById(id);
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
const DeleteType = async(req , res ,next)=>{
    try{
        const id = req.param.id
        const result = await Type.findByIdAndDelete(id);
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

module.exports = {getAllType , AddType ,UpdateType , DeleteType}