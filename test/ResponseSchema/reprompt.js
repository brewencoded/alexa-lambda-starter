const {
    expect
} = require('chai');
const Joi = require('joi');
const Request = require('../../schema/ResponseSchema');

module.exports = () => {
    it('should accept text when type is plaintext', () => {
        Joi.validate({
            version: '1.0',
            response: {
                reprompt: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: 'test'
                    }
                }
            }
        },
        Request,
        (err) => expect(err).to.be.null);
    });
    it('should accept ssml  when type is ssml', () => {
        Joi.validate({
            version: '1.0',
            response: {
                reprompt: {
                    outputSpeech: {
                        type: 'SSML',
                        ssml: '<>test<>'
                    }
                }
            }
        },
        Request,
        (err) => expect(err).to.be.null);
    });
    it('should not accept text when type is ssml', () => {
        Joi.validate({
            version: '1.0',
            response: {
                reprompt: {
                    outputSpeech: {
                        type: 'SSML',
                        text: 'test'
                    }
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));

    });
    it('should not accept ssml when type is plain text', () => {
        Joi.validate({
            version: '1.0',
            response: {
                reprompt: {
                    outputSpeech: {
                        type: 'PlainText',
                        ssml: '<>test<>'
                    }
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
};
