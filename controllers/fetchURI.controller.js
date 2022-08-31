const { createCustomError } = require("../errors/customAPIError")
const path = require('path')
const puppeteer = require('puppeteer')
const fetchURI = async(req ,res ,next)=>{
    try{
        const uri = req.body.uri
        const type = req.body.type
        const browser = await puppeteer.launch({
          headless:true,
          args: ["--no-sandbox"]
        });
        const page = await browser.newPage();
        await page.goto(`${uri}`,{
          waitUntil:'networkidle2'
        });
        const dimensions = await page.evaluate(() => {
          return {
            width: document.body.scrollWidth,
            height: document.body.scrollHeight,
          };
        });
        setTimeout(async() => {
            console.log(dimensions.height)
            const filename = Date.now()+''
            page.setViewport({ width: (type=='mobile')? 480 :  dimensions.width, height: dimensions.height })
            await page.screenshot({
              path: path.join(__dirname ,`../public/`,`${filename}`) +".png",
              type:"png",
              fullPage: (type=='mobile')? false : true
            });
            await browser.close();
            res.json(`http://localhost:8080/public/${filename}.png`)
        },1500); 
    }
    catch(err){
        next(createCustomError(err,400));
    }
}

module.exports = {fetchURI}