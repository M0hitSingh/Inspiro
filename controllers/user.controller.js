const asyncWrapper = require('../util/asyncWrapper');
const User = require("../model/User");
const { createCustomError } = require('../errors/customAPIError');
const APIFeatures = require('../util/APIfeature');
const { sendSuccessApiResponse } = require('../middleware/successApiResponse');
const getAllUser =  asyncWrapper(async (req, res, next)=>{
    const SearchString = ["Name"]
    const isAdmin =await User.findById(req.user.userId);
    if(isAdmin.role !='Admin'){
        return next(createCustomError(`${req.user.userId} is not Admin`,401));
    }
    const query = new APIFeatures(User.find(),req.query)
    .filter()
    .sort()
    .page()
    .limit()
    .search(SearchString)
    const data = await query.query;
    const getCount = await User.countDocuments();
    const response = sendSuccessApiResponse({data,getCount})
    res.status(200).json(response);
})

const UpdateUser = asyncWrapper(async (req,res,next)=>{
    const {firstName, lastName, email, role, webURL, location, isActive ,sendNewsletter , canSubmit , profiles} = req.body
    const isUser =await User.findById(req.user.userId);
    if(isUser._id.toString() != req.user.userId.toString() || isUser.role !=='Admin' ){
        return next(createCustomError(`${req.user.userId} is not Authorized`,401));
    }
    await User.findByIdAndUpdate(req.user.userId,{
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
    const data = await User.findById(req.user.userId);
    const response = sendSuccessApiResponse(data)
    res.status(200).json(response);
})

module.exports = {getAllUser , UpdateUser}