exports.helloWorld = function (callback) {
    callback(null, {
        'version': '1.0',
        'response': {
            'outputSpeech': {
                'type': 'PlainText',
                'text': 'Hello World'
            },
            'shouldEndSession': true
        }
    });
};
