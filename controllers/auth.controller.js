const crypto = require("crypto")
const bcrypt = require('bcryptjs')
const express = require("express");
const otpGenrator = require('otp-generator')
const jwt = require("jsonwebtoken");
const { createCustomError } = require("../errors/customAPIError");
const { sendSuccessApiResponse } = require("../middleware/successApiResponse");
const Otp = require("../model/Otp");
const User = require("../model/User")
const sendEmail = require("../util/email")


const refreshToken= async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        const message = "Unauthenticaded No Bearer";
        return next(createCustomError(message, 401));
    }

    let data;
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        data = await getNewToken(payload);
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            const payload = jwt.decode(token, { complete: true }).payload;
            data = await getNewToken(payload);

            if (!data) {
                const message = "Authentication failed invalid JWT";
                return next(createCustomError(message, 401));
            }
        } else {
            const message = "Authentication failed invalid JWT";
            return next(createCustomError(message, 401));
        }
    }

    res.status(200).json(sendSuccessApiResponse(data, 200));
};

const getUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        const message = "Unauthenticaded No Bearer";
        return next(createCustomError(message, 401));
    }

    let data;
    const token = authHeader.split(" ")[1];
    try {
        const payload= jwt.verify(token, process.env.JWT_SECRET);
        const user =await User.findById(payload.userId);
        data = user
    } catch (error) {
            const message = "Authentication failed invalid JWT";
            return next(createCustomError(message, 401));
    }

    res.status(200).json(sendSuccessApiResponse(data, 200));
};

const getNewToken = async (payload) => {
    const isUser = payload?.userId ? true : false;

    let data
    if (isUser) {
        const user = await User.findOne({ isActive: true, _id: payload.userId });
        if (user) {
            data = { token: user.generateJWT() };
        }
    }
    return data;
};

const registerUser = async (req, res, next) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            gender,
            role,
        } = req.body;
    
        const toStore = {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            gender,
            role,
        };
    
        const emailisActive = await User.findOne({ email, isActive: true , isVerified:true});
        if (emailisActive) {
            const message = "Email is already registered";
            return next(createCustomError(message, 406));
        }
    
        const phoneNumberisActive = await User.findOne({ phoneNumber, isActive: true , isVerified:true});
    
        if (phoneNumberisActive) {
            const message = "Phone number is already registered";
            return next(createCustomError(message, 406));
        }
        const OTPgen = otpGenrator.generate(5,{
            digits:true, lowerCaseAlphabets : false, upperCaseAlphabets:false,
            specialChars:false
        })
        const OTP = await Otp.updateOne({email:email},{email:email , otp:OTPgen},{upsert:true});
        await sendEmail({
            email: email,
            subject: "Your OTP (Valid for 5 minutes)",
            message:`Your One Time Password is ${OTPgen}`
        });
        const notVerifiedUser = await User.find({email:email});
        if(notVerifiedUser.length){
            res.status(200).json(sendSuccessApiResponse(notVerifiedUser,200));
        }
        else{
            const user = await User.create(toStore);
            res.status(201).json(sendSuccessApiResponse(data, 201));
        }
    }
    catch(err){
        return createCustomError(err,400);
    }
};

const loginUser = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        const emailExists = await User.findOne(
            { email, isActive: true , isVerified:true},
            "firstName lastName email username password role"
        );
        if (!emailExists) {
            const message = "Invalid credentials";
            return next(createCustomError(message, 401));
        }   
    
        const isPasswordRight = await emailExists.comparePassword(password);
        if (!isPasswordRight) {
            const message = "Invalid credentials";
            return next(createCustomError(message, 401));
        }
    
        const data = {
            firstName: emailExists.firstName,
            lastName: emailExists.lastName,
            email: emailExists.email,
            token: emailExists.generateJWT(),
        };
    
        res.status(200).json(sendSuccessApiResponse(data));
    }
    catch(err){
        return createCustomError(err,400);
    }
};

const forgotPassword = async (req, res, next) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email, isActive: true , isVerified:true });
        if (!user) {
            const message = `No user found with the email: ${email}`;
            return next(createCustomError(message, 400));
        }
        const OTPgen = otpGenrator.generate(5,{
            digits:true, lowerCaseAlphabets : false, upperCaseAlphabets:false,
            specialChars:false
        })
        const OTP = await Otp.updateOne({email:email},{email:email , otp:OTPgen},{upsert:true});
        await sendEmail({
            email: email,
            subject: "Your OTP (Valid for 5 minutes)",
            message:`Your One Time Password is ${OTPgen}`
        });
        res.status(200).json('OTP send')
    }
    catch(err){
        return createCustomError(err,400);

    }
};

const otpValid = async (req, res, next) => {
    try{
        const {otp,email} = req.body;
        const verify = await Otp.findOne({email:email,otp:otp});
        if(!verify){
            const message = "Invalid token or Token expired";
            return next(createCustomError(message));
        }
    
        const user = await User.findOneAndUpdate({email:email},{isVerified:true});
        const data = {user,token: user.generateJWT()}    
        const response = sendSuccessApiResponse(data);
        res.status(200).json(response);
    }
    catch(err){
        return createCustomError(err,400);
    }
};

const resetPassword = async (req, res, next) => {
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email:email});
        if (!user) {
            const message = "No User exist";
            return next(createCustomError(message));
        }
        user.password = password;
        await user.save();
        res.json({ message: "Password changed successfully", token: user.generateJWT() });
    }
    catch(err){
        return createCustomError(err,400);
    }
};

const updatePassword = async (req, res, next) => {
    try{
        const { currentPassword, newPassword } = req.body;
        const id = req.body.id;
        console.log(id)
        const user = await User.findOne({_id: id,isActive:true ,isVerified:true});
        if (!user) {
            const message = "There was an error finding the email";
            return next(createCustomError(message, 401));
        }
    
        const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordCorrect) {
            const message = "Invalid current password";
            return next(createCustomError(message, 400));
        }
    
        user.password = newPassword;
        await user.save();
    
        const data = { updatedPassword: true, email: user.email };
        const response = sendSuccessApiResponse(data);
        res.status(200).json(response);
    }
    catch(err){
        return createCustomError(err,400);
    }
};



module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    resetPassword,
    otpValid,
    updatePassword,
    refreshToken,
    getUser
};
