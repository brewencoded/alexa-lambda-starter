const Joi = require('joi');
const {
    PLAYER_ACTIVITY,
    INTENT_REQUEST,
    LAUNCH_REQUEST,
    SESSION_ENDED_REQUEST
} = require('../constants/SchemaConstants');

// version specifier for the request format: x.x
const version = Joi.string().min(3).required();
// object for maintaining a session between user, skill, and alexa
// included for all statndard requests, except AudioPlayer and PlaybackController
const session = Joi.object().keys({
    new: Joi.boolean().required(),
    sessionId: Joi.string().required(),
    application: Joi.object().keys({
        applicationId: Joi.string().required() // whitelist your skill
    }).required(),
    attributes: Joi.object().required().min(1),
    user: Joi.object().keys({
        userId: Joi.string().required().max(255),
        accessToken: Joi.string().optional() // only if the user has linked their account
    }).required()
});
// A system object that provides information about the current state of the Alexa service and the device interacting with your skill.
const System = Joi.object().keys({
    application: Joi.object().keys({
        applicationId: Joi.string().required()
    }),
    user: Joi.object().keys({
        userId: Joi.string().required().max(255),
        accessToken: Joi.string().optional() // only if the user has linked their account
    }),
    device: Joi.object().keys({
        supportedInterfaces: Joi.object()
    }),
});
// Provides the current state for the AudioPlayer interface.
const AudioPlayer = Joi.object().keys({
    token: Joi.string(),
    offsetInMilliseconds: Joi.number(),
    playerActivity: Joi.string().valid(PLAYER_ACTIVITY.IDLE, PLAYER_ACTIVITY.PAUSED, PLAYER_ACTIVITY.PLAYING,
        PLAYER_ACTIVITY.BUFFER_UNDERRUN, PLAYER_ACTIVITY.FINISHED, PLAYER_ACTIVITY.STOPPED)
});
// Provides your skill with information about the current state of the Alexa service and device at the time the request is sent to your service.
// This is included on all requests.
const context = Joi.object().keys({
    System,
    AudioPlayer
});
// A request object that provides the details of the user’s request.
const request = Joi.object().keys({
    type: Joi.string().valid(INTENT_REQUEST, SESSION_ENDED_REQUEST, LAUNCH_REQUEST).required(),
    requestId: Joi.string(),
    timestamp: Joi.string(),
    locale: Joi.string(),
    intent: Joi.object()
        .keys({
            name: Joi.string().required(),
            slots: Joi.object().optional()
        })
        .when('type', {
            is: INTENT_REQUEST,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
    reason: Joi.string()
        .when('type', {
            is: SESSION_ENDED_REQUEST,
            then: Joi.required(),
            otherwise: Joi.forbidden()
        }),
    error: Joi.object()
        .keys({
            type: Joi.string().required(),
            message: Joi.string().optional()
        })
        .when('type', {
            is: SESSION_ENDED_REQUEST,
            then: Joi.optional(),
            otherwise: Joi.forbidden()
        })
});
module.exports = Joi.object().keys({
    version,
    session,
    context,
    request
})
.without('context.AudioPlayer', ['session'])
.options({ convert: false });
