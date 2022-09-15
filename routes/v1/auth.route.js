const express =  require("express");
const {
    forgotPassword,
    loginUser,
    refreshToken,
    registerUser,
    resetPassword,
    otpValid,
    updatePassword,
    getUser,
    resetPasswordLink
} = require("../../controllers/auth.controller");
const authorization = require("../../middleware/authorization");

/**
 * Endpoint: /api/v1/auth
 */
const router = express.Router();


router.route("/refresh-token").get(refreshToken);

// User
router.route("/get-user").get(getUser);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").get(resetPassword)
router.route("/reset-password").post(resetPasswordLink)
router.route("/otp-verify").post(otpValid); 
router.route("/update-password").patch(updatePassword);




module.exports = router;
