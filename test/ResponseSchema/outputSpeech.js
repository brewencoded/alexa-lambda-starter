const {
    expect
} = require('chai');
const Joi = require('joi');
const ResponseSchema = require('../../schema/ResponseSchema');

const validOutputSpeech = {
    type: 'PlainText',
    text: 'test'
};

function mockResponse(outputSpeech = validOutputSpeech) {
    return {
        version: '1.0',
        response: {
            outputSpeech
        }
    };
}

module.exports = () => {
    it('should accept text when type is plaintext', () => {
        const response = mockResponse();
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should accept ssml  when type is ssml', () => {
        const outputSpeech = Object.assign({}, validOutputSpeech, {
            type: 'SSML',
            ssml: '<>test<>'
        });
        delete outputSpeech.text;
        const response = mockResponse(outputSpeech);
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept text when type is ssml', () => {
        const outputSpeech = Object.assign({}, validOutputSpeech, {
            type: 'SSML',
            text: 'test'
        });
        const response = mockResponse(outputSpeech);
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept ssml when type is plain text', () => {
        const outputSpeech = Object.assign({}, validOutputSpeech, {
            type: 'PlainText',
            ssml: '<>test<>'
        });
        const response = mockResponse(outputSpeech);
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
};
