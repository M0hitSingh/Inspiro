const express =  require("express");

const router = express.Router();

/**
 * Endpoint: /api/v1/landingpage
 */

const  { getLimitedWebsite} =  require('../../controllers/landing.page.controller')
const authorization = require("../../middleware/authorization");
router
    .route("/websitesLanding")
    .get(getLimitedWebsite)

module.exports = router;