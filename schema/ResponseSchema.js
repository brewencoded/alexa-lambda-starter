const Joi = require('joi');
const {
    REPLACE_ALL,
    ENQUEUE,
    REPLACE_ENQUEUED,
    CLEAR_ENQUEUED,
    CLEAR_ALL,
    AUDIOPLAYER
} = require('../constants/SchemaConstants');

// version specifier for the response
const version = Joi.string().min(3).required();
// a map of key value pairs to persist in the session
const sessionAttributes = Joi.object().keys();
// speech alexa is to process
const outputSpeech = Joi.object()
    .keys({
        type: Joi.string().allow('PlainText', 'SSML').required(),
        text: Joi.string()
            .when('type', {
                is: 'PlainText',
                then: Joi.required()
            }),
        ssml: Joi.string()
            .when('type', {
                is: 'SSML',
                then: Joi.required()
            })
    });
// card to display in alexa app
const card = Joi.object()
    .keys({
        type: Joi.string().required().allow('Simple', 'Standard', 'LinkAccount'),
        title: Joi.string()
            .when('type', {
                is: 'LinkAccount',
                then: Joi.forbidden()
            }),
        content: Joi.string()
            .when('type', {
                is: 'Simple',
                then: Joi.optional(),
                otherwise: Joi.forbidden()
            }),
        text: Joi.string()
            .when('type', {
                is: 'Standard',
                then: Joi.optional(),
                otherwise: Joi.forbidden()
            }),
        image: Joi.object()
            .keys({
                smallImageUrl: Joi.string(),
                largeImageUrl: Joi.string()
            }).when('type', {
                is: 'Standard',
                then: Joi.optional(),
                otherwise: Joi.forbidden()
            })
    });
// speech alexa is to process when a reprompt is needed
const reprompt = Joi.object()
    .keys({
        outputSpeech
    });
// audio directives. Monitors and controls streaming audio and managing playback
// When sending a Play directive, you normally set the shouldEndSession flag in
// the response object to true to end the session.
// REPLACE_ALL: Immediately begin playback of the specified stream, and replace current and enqueued streams.
// ENQUEUE: Add the specified stream to the end of the current queue. This does not impact the currently playing stream.
// REPLACE_ENQUEUED: Replace all streams in the queue. This does not impact the currently playing stream.
const directives = Joi.array()
    .items(Joi.object()
        .keys({
            type: Joi.string().required().allow(AUDIOPLAYER.PLAY, AUDIOPLAYER.STOP, AUDIOPLAYER.CLEAR_QUEUE),
            playBehavior: Joi.string().allow(REPLACE_ALL, ENQUEUE, REPLACE_ENQUEUED)
                .when('type', {
                    is: AUDIOPLAYER.PLAY,
                    then: Joi.required(),
                    otherwise: Joi.forbidden()
                }),
            clearBehavior: Joi.string().allow(CLEAR_ENQUEUED, CLEAR_ALL)
                .when('type', {
                    is: AUDIOPLAYER.CLEAR_QUEUE,
                    then: Joi.required(),
                    otherwise: Joi.forbidden()
                }),
            audioItem: Joi.object().required()
                .keys({
                    stream: Joi.object().required().keys({
                        url: Joi.string().required(),
                        token: Joi.string().required(),
                        expectedPreviousToken: Joi.string(),
                        offsetInMilliseconds: Joi.number().required()
                    })
                }),
        }).assert('audioItem.stream.expectedPreviousToken', Joi.string().when('playBehavior', {
            is: ENQUEUE,
            then: Joi.required()
        })));
// an object that defines what to send to the user and whether to end the session
const response = Joi.object().keys({
    outputSpeech,
    card,
    reprompt,
    directives,
    shouldEndSession: Joi.boolean()
});

module.exports = Joi.object().keys({
    version,
    sessionAttributes,
    response
}).options({ convert: false });
