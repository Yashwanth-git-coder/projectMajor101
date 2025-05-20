const Joi = require('joi');


module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title:       Joi.string().required(),
    description: Joi.string().allow(""),
    // ← make image optional, and validate both url & filename if present
    image: Joi.object({
      url:      Joi.string().uri().required(),
      filename: Joi.string().required()
    })
      .optional(),          // ← no longer required on updates
    price:    Joi.number().required(),
    location: Joi.string().required(),
    country:  Joi.string().required()
  }).required()
});


module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});