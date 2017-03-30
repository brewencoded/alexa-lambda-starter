const Joi = require('joi');
const {
} = require('../constants/SchemaConstants');

// version specifier for the request format: x.x
const version = Joi.string().min(3).required();
// object for maintaining a session between user, skill, and alexa
// included for all statndard requests, except AudioPlayer and PlaybackController
const session = Joi.object().keys({
    new: Joi.boolean().required(),
    sessionId: Joi.string().required(),
    application: Joi.object.keys({
        applicationId: Joi.string().required() // whitelist your skill
    }).required(),
    attributes: Joi.object().required().min(1),
    user: Joi.object().keys({
        userId: Joi.string().required().max(255),
        accessToken: Joi.string().optional() // only if the user has linked their account
    }).required()
}).when({
    // do not allow with AudioPlayer or PlaybackController
});

module.exports = Joi.object().keys({
    version,
    session
});
