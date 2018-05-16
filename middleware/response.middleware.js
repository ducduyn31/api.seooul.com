import Response from "../fancy-response/response";

export default (req,res, next) => {

    res.responder.fire();
}
