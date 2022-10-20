const asyncWrapper = require('../util/asyncWrapper');
const User = require("../model/User");
const { createCustomError } = require('../errors/customAPIError');
const APIFeatures = require('../util/APIfeature');
const { sendSuccessApiResponse } = require('../middleware/successApiResponse');
const getUser = asyncWrapper(async (req,res,next)=>{
    const user = req.params.id;
    const isUser = await User.findById(user);
    if(!isUser){
        return next(createCustomError(`${req.user.userId} Not Found`,404));
    }
    const response = sendSuccessApiResponse(isUser)
    res.status(200).json(response);
})
const getAllUser =  asyncWrapper(async (req, res, next)=>{
    const SearchString = ["firstName","lastName"]
    const isAdmin =await User.findById(req.user.userId);
    if(isAdmin.role !='Admin'){
        return next(createCustomError(`${req.user.userId} is not Admin`,401));
    }
    const query = new APIFeatures(User.find({isActive:true}),req.query)
    .filter()
    .sort()
    .page()
    .limit()
    .search(SearchString)
    const data = await query.query;
    const getCount = await User.countDocuments({isActive:true});
    const response = sendSuccessApiResponse({data,getCount})
    res.status(200).json(response);
})
const   deleteUser = asyncWrapper(async (req,res,next)=>{
    const id = req.params.id;
    const isAdmin =await User.findById(req.user.userId);
    if(isAdmin.role !='Admin'){
        return next(createCustomError(`${req.user.userId} is not Admin`,401));
    }
    const user = await User.findById(id);
    user.isActive = false;
    await user.save();
    const response = sendSuccessApiResponse(user)
    res.status(200).json(response);
})
const UpdateUser = asyncWrapper(async (req,res,next)=>{
    const {id,firstName, lastName, email, role, webURL, location, isActive ,sendNewsletter , canSubmit , profiles} = req.body
    const isUser =await User.findById(id);
    if(id.toString() != req.user.userId.toString() && isUser.role !=='Admin' ){
        return next(createCustomError(`${req.user.userId} is not Authorized`,401));
    }
    await User.findByIdAndUpdate(id,{
        firstName:firstName,
        lastName:lastName,
        email:email,
        role:role,
        webURL:webURL,
        location:location,
        isActive:isActive,
        sendNewsletter:sendNewsletter,
        canSubmit:canSubmit,
        profiles:profiles
    })
    const data = await User.findById(id);
    const response = sendSuccessApiResponse(data)
    res.status(200).json(response);
})
const uploadAvatar = asyncWrapper(async (req, res, next)=>{
    const id = req.params.id;
    let filename = req.files;
    if(filename){
        await User.findByIdAndUpdate(id,{
            avatar:"/public/WebsiteSS/"+filename.avatar[0].originalname
        })
        const user = await User.findById(id)
        const response = sendSuccessApiResponse(user)
        res.status(200).json(response);
    }
    else{
        return next(createCustomError("Could Not upload",402));
    }
})
module.exports = {getAllUser , UpdateUser ,getUser, uploadAvatar, deleteUser}