const {
    expect
} = require('chai');
const Joi = require('joi');
const Request = require('../../schema/ResponseSchema');
const outputSpeech = require('./outputSpeech');
const card = require('./card');

describe('ResponseSchema', () => {
    describe('version', () => {
        it('should not have errors with a valid version', () => {
            Joi.validate({
                version: '1.0'
            },
            Request,
            (err) => expect(err).to.be.null);
        });
        it('should return ValidationError for an invalid version', () => {
            Joi.validate({
                version: 1.0
            },
            Request,
            (err) => expect(err.name).to.equal('ValidationError'));
        });
        it('should accept an object in sessionAttributes', () => {
            Joi.validate({
                version: '1.0',
                sessionAttributes: {
                    'testKey': 'testValue'
                }
            },
            Request,
            (err) => expect(err).to.be.null);
        });
        it('should return a ValidationError for invalid sessionAttributes', () => {
            Joi.validate({
                version: '1.0',
                sessionAttributes: 1
            },
            Request,
            (err) => expect(err.name).to.be.equal('ValidationError'));
        });
    });
    describe('response', () => {
        describe('outputSpeech', outputSpeech);
        describe('card', card);
    });
});
