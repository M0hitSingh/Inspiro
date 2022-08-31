const { response } = require("express");
const { createCustomError } = require("../errors/customAPIError")
const { sendSuccessApiResponse } = require("../middleware/successApiResponse")
const Category = require("../model/categoryMaster")
const getAllCategory = async(req ,res, next)=>{
    try{
        const category =await Category.find().populate("Addedby")
        const response = sendSuccessApiResponse(category)
        res.status(200).json(response);
    }
    catch(err){
        next(createCustomError(err,400));
    }
};

const AddCategory = async(req ,res, next)=>{
    try{
        const Addedby = req.user.userId
        const category = req.body.Name;
        const isCategory =await Category.findOne({Name:category});
        if(isCategory){
            const message = "Tag Already Exist";
            return next(createCustomError(message, 301));
        }
        const doc = new Category({
            Name:category,
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

const UpdateCategory = async(req , res ,next)=>{
    try{
        const id = req.body.Id
        const Name = req.body.Name;
        const result = await Category.findById(id);
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
const DeleteCategory = async(req , res ,next)=>{
    try{
        const id = req.param.id
        const result = await Category.findByIdAndDelete(id);
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

module.exports =  {getAllCategory , AddCategory ,UpdateCategory,DeleteCategory}