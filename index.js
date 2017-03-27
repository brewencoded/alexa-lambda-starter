const {
    INTENT_REQUEST,
    HELLO_WORLD
} = require('./constants.js');

const {
    helloWorld
} = require('./fn');

exports.handler = function (event, context, callback) {
    const { type, intent } = event.request;
    if (type === INTENT_REQUEST) {
        switch (intent.name) {
            case HELLO_WORLD:
                helloWorld(callback);
                break;
            default:
                break;
        }
    }
};
