const Joi = require("joi");
const ExpressError = require("./utils/ExpressError.js"); 

module.exports.listingSchema = Joi.object({
listing: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().allow("" , null)
}).required(),
});