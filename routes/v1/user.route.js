const express = require("express");
const  {getAllUser, UpdateUser, getUser} = require("../../controllers/user.controller")


/**
 * Endpoint: /api/v1/user
 */
const router = express.Router();

router
    .route("/admin")
    .get(getAllUser);

router
    .route("/")
    .get(getUser)
    .post(UpdateUser)
module.exports = router;