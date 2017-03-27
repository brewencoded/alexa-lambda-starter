const {
    expect
} = require('chai');
const Joi = require('joi');
const Request = require('../schema/ResponseSchema');

describe('ResponseSchema.js', () => {
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

describe('ResponseSchema.response', () => {
    describe('outputSpeech', () => {
        it('should accept text when type is plaintext', () => {
            Joi.validate({
                version: '1.0',
                response: {
                    outputSpeech: {
                        type: 'PlainText',
                        text: 'test'
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
                    outputSpeech: {
                        type: 'SSML',
                        ssml: '<>test<>'
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
                    outputSpeech: {
                        type: 'SSML',
                        text: 'test'
                    }
                }
            },
            Request,
            (err) => expect(err.name).to.equal('ValidationError'));

        });
        it('should not accept text when type is ssml', () => {
            Joi.validate({
                version: '1.0',
                response: {
                    outputSpeech: {
                        type: 'PlainText',
                        ssml: '<>test<>'
                    }
                }
            },
            Request,
            (err) => expect(err.name).to.equal('ValidationError'));
        });
    });
    describe('card', () => {
        it('should accept a string in type property', () => {
            Joi.validate({
                version: '1.0',
                response: {
                    card: {
                        type: 'Simple'
                    }
                }
            },
            Request,
            (err) => {
                expect(err).to.be.null;
            });
        });
        it('should not accept any other type in type property', () => {
            Joi.validate({
                version: '1.0',
                response: {
                    card: {
                        type: 1
                    }
                }
            },
            Request,
            (err) => {
                expect(err.name).to.equal('ValidationError');
            });
        });
        it('should accept title if type is not LinkAccount', () => {
            Joi.validate({
                version: '1.0',
                response: {
                    card: {
                        type: 'Simple',
                        title: 'TestTitle'
                    }
                }
            },
            Request,
            (err) => {
                expect(err).to.be.null;
            });
        });
        it('should accept content if type is not LinkAccount or Standard', () => {
            Joi.validate({
                version: '1.0',
                response: {
                    card: {
                        type: 'Simple',
                        content: 'test'
                    }
                }
            },
            Request,
            (err) => {
                expect(err).to.be.null;
            });
        });
    });
});
