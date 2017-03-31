const {
    expect
} = require('chai');
const Joi = require('joi');
const Request = require('../../schema/RequestSchema');
const session = require('./session');

describe('RequestSchema', () => {
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
    });
    describe('session', session);
});
