const Joi = require('joi');

// version specifier for the response
const version = Joi.string().min(3).required();
// a map of key value pairs to persist in the session
const sessionAttributes = Joi.object().keys();
// speech alexa is to process
const outputSpeech = Joi.object()
    .keys({
        type: Joi.string().allow('PlainText', 'SSML').required(),
        text: Joi.string().when('type', {
            is: 'PlainText',
            then: Joi.required()
        }),
        ssml: Joi.string().when('type', {
            is: 'SSML',
            then: Joi.required()
        })
    });
// card to display in alexa app
const card = Joi.object()
    .keys({
        type: Joi.string().required().allow('Simple', 'Standard', 'LinkAccount'),
        title: Joi.string().when('type', {
            is: 'LinkAccount',
            then: Joi.forbidden()
        }),
        content: Joi.string().when('type', {
            is: 'LinkAccount',
            then: Joi.forbidden()
        }).when('type', {
            is: 'Standard',
            then: Joi.forbidden()
        }),
        text: Joi.string().when('type', {
            is: 'LinkAccount',
            then: Joi.forbidden()
        }).when('type', {
            is: 'Simple',
            then: Joi.forbidden()
        }),
        image: Joi.object().keys({
            smallImageUrl: Joi.string(),
            largeImageUrl: Joi.string()
        }).when('type', {
            is: 'Simple',
            then: Joi.forbidden()
        }).when('type', {
            is: 'LinkAccount',
            then: Joi.forbidden()
        })
    });
// speech alexa is to process when a reprompt is needed
const reprompt = Joi.object()
    .keys({
        outputSpeech
    });
// audio directives. Monitors and controls streaming audio and managin playback
const directives = Joi.object()
    .keys({
    });
// a response object that defines what to send to the user and whether to end the session
const response = Joi.object().keys({
    outputSpeech,
    card,
    reprompt
});

module.exports = Joi.object().keys({
    version,
    sessionAttributes,
    response
});
