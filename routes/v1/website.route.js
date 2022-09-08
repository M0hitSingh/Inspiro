const express =  require("express");
const  {addWebsite, getWebsite, updateWebsite, softdeleteWebsite, publishWebsite} =  require('../../controllers/website.controller')
const authorization = require("../../middleware/authorization");
const upload = require("../../middleware/fileUpload");

/**
 * Endpoint: /api/v1/website
 */
const router = express.Router();

router
    .route("/:id")
    .get(getWebsite)
    .post(publishWebsite)
    .delete(softdeleteWebsite)
router
    .route("/add")
    .post(upload.fields([{name:'MobileSS'},{name:'DesktopSS'}]),addWebsite)
router
    .route("/update")
    .patch(upload.fields([{name:'MobileSS'},{name:'DesktopSS'}]),updateWebsite)

module.exports = router;