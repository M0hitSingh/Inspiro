const express = require("express");
const  {getAllUser, UpdateUser} = require("../../controllers/user.controller")


/**
 * Endpoint: /api/v1/user
 */
const router = express.Router();

router
    .route("/admin")
    .get(getAllUser);

router
    .route("/")
    .post(UpdateUser)
module.exports = router;