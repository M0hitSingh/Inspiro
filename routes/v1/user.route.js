const express = require("express");
const  {getAllUser, UpdateUser, getUser, uploadAvatar, deleteUser} = require("../../controllers/user.controller");
const upload = require("../../middleware/fileUpload");


/**
 * Endpoint: /api/v1/user
 */
const router = express.Router();

router
    .route("/admin")
    .get(getAllUser);

router
    .route("/:id")
    .get(getUser)
    .delete(deleteUser)
router
    .route("/")
    .post(UpdateUser)
router
    .route("/profile-upload/:id")
    .post(upload.fields([{name:'avatar'}]),uploadAvatar)
    
module.exports = router;