const  express =  require("express");
const {getAllTag , AddTag ,UpdateTag , DeleteTag} = require('../../controllers/tag.controller')
const authorization = require("../../middleware/authorization");

/**
 * Endpoint: /api/v1/tag-master
 */
const router = express.Router();

router
    .route("/")
    .get(getAllTag)
    .post(AddTag)
    .patch(UpdateTag)
    .delete(DeleteTag)

module.exports = router;