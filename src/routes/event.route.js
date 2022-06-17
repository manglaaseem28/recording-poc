/**
 * Events Route
 * 
 */

const eventController = require("../controllers/event.controller");
const path = "/events"
const authService = require('../services/auth.service')
// const responseMiddleWare = require("../middlewares/responseHandler")   //middleware for handling error and response
// validations middleware


module.exports = (basePath, router) => {
     console.log(`Registering ${basePath} ----- ${path} routes`);

    // defining an endpoint to return all ads
    router.get(basePath + path + '/signedUrl', authService.keytoken, eventController.getSignedUrl)
    router.get(basePath + path + '/recordings', authService.keytoken, eventController.getRecording);
    router.post(basePath + path + '/events', eventController.handleEvent);
}

