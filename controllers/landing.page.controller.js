const WebsiteMaster = require('../model/WebsiteMaster');

const getLimitedWebsite = async(req,res,next)=>{
    try {
        // res.send("sas")
        await WebsiteMaster.findRandom({}, {}, {limit: 3}, function(err, results) {
            if (!err) {
              console.log(results); // 5 elements
            }
            return res.send(results)
          });
        // const ress = await WebsiteMaster.find({})
        // console.log(ress);
        // res.send(ress)
    } catch (error) {
        next(createCustomError(err,400))
    }
}
module.exports = {getLimitedWebsite}