const asyncWrapper = require('../util/asyncWrapper');
const User = require("../model/User");
const { createCustomError } = require('../errors/customAPIError');
const APIFeatures = require('../util/APIfeature');
const { sendSuccessApiResponse } = require('../middleware/successApiResponse');
const getAllUser =  asyncWrapper(async (req, res, next)=>{
    const SearchString = ["Name"]
    const isAdmin =await User.findById(req.user.userId);
    if(isAdmin.role=='Admin'){
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
    const isUser =await User.findById(req.user.userId);
    console.log(isUser._id.toString())
    req.user.userId = req.user.userId+"2"
    console.log(isUser.role)

    if(isUser._id.toString() != req.user.userId.toString() || isUser.role =='Admin' ){
        return next(createCustomError(`${req.user.userId} is not Authorized`,401));
    }
    const response = sendSuccessApiResponse('Update user')
    res.status(200).json(response);
})

module.exports = {getAllUser , UpdateUser}