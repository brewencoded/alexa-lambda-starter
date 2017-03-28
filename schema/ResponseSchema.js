const Joi = require('joi');

// version specifier for the response
const version = Joi.string().min(3).required();
// a map of key value pairs to persist in the session
const sessionAttributes = Joi.object().keys();
// a response object that defines what to send to the user and wether to end the session
const response = Joi.object().keys({
    outputSpeech: Joi.object()
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
        }),
    card: Joi.object()
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
        })
});

module.exports = Joi.object().keys({
    version, 
    sessionAttributes,
    response
});



