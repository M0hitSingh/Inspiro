const express =  require("express");
const  {addWebsite, getWebsite, updateWebsite, softdeleteWebsite, publishWebsite, geUrltWebsite} =  require('../../controllers/website.controller')
const authorization = require("../../middleware/authorization");
const upload = require("../../middleware/fileUpload");

/**
 * Endpoint: /api/v1/website
 */
const router = express.Router();

router
    .route("/url")
    .post(geUrltWebsite);
router
    .route("/:id")
    .get(getWebsite)
    .delete(softdeleteWebsite)
router
    .route("/add")
    .post(upload.fields([{name:'MobileSS'},{name:'DesktopSS'}]),addWebsite)
router
    .route("/update")
    .patch(upload.fields([{name:'MobileSS'},{name:'DesktopSS'}]),updateWebsite)
router
    .route("/save/:id")
    .post(publishWebsite)

module.exports = router;