const {
    expect
} = require('chai');
const Joi = require('joi');
const ResponseSchema = require('../../schema/ResponseSchema');
const {
    REPLACE_ALL,
    ENQUEUE,
    REPLACE_ENQUEUED,
    CLEAR_ENQUEUED,
    CLEAR_ALL,
    AUDIOPLAYER
} = require('../../constants/SchemaConstants');

const validDirective = {
    type: AUDIOPLAYER.PLAY,
    playBehavior: ENQUEUE,
    audioItem: {
        stream: {
            url: 'test/url',
            token: 'testtoken',
            expectedPreviousToken: 'testprevioustoken',
            offsetInMilliseconds: 0
        }
    }
};

function mockResponse(directives = [validDirective]) {
    return {
        version: '1.0',
        response: {
            directives
        }
    };
}

module.exports = () => {
    it('should accept a valid array of directives', () => {
        const response = mockResponse();
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept an array of any other type', () => {
        const response = mockResponse([1]);
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should accept a directive of type play with enqueue behavior', () => {
        const directive = Object.assign({}, validDirective, { type: AUDIOPLAYER.PLAY });
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should accept a directive of type play with replace all behavior', () => {
        const directive = Object.assign({}, validDirective, {
            type: AUDIOPLAYER.PLAY,
            playBehavior: REPLACE_ALL
        });
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should accept a directive of type play with replace enqueued behavior', () => {
        const directive = Object.assign({}, validDirective, {
            type: AUDIOPLAYER.PLAY,
            playBehavior: REPLACE_ENQUEUED
        });
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should accept a directive of type stop', () => {
        const directive = Object.assign({}, validDirective, { type: AUDIOPLAYER.STOP });
        delete directive.playBehavior;
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should accept a directive of type clear queue with clear enqueued behavior', () => {
        const directive = Object.assign({}, validDirective, {
            type: AUDIOPLAYER.CLEAR_QUEUE,
            clearBehavior: CLEAR_ENQUEUED
        });
        delete directive.playBehavior;
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should accept a directive of type clear queue with clear all behavior', () => {
        const directive = Object.assign({}, validDirective, {
            type: AUDIOPLAYER.CLEAR_QUEUE,
            clearBehavior: CLEAR_ALL
        });
        delete directive.playBehavior;
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should not allow empty expectedPreviousToken when playBehavior is enqueue', () => {
        const directive = Object.assign({}, validDirective, {
            playBehavior: ENQUEUE
        });
        delete directive.audioItem.stream.expectedPreviousToken;
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept clearBehavior when type is play', () => {
        const directive = Object.assign({}, validDirective, {
            type: AUDIOPLAYER.PLAY,
            clearBehavior: CLEAR_ALL
        });
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept playBehavior when type is clear', () => {
        const directive = Object.assign({}, validDirective, {
            type: AUDIOPLAYER.CLEAR_QUEUE,
            clearBehavior: CLEAR_ALL
        });
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept non-string in playBehavior', () => {
        const directive = Object.assign({}, validDirective, {
            playBehavior: 1
        });
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err.details[0].message).to.equal('"playBehavior" must be a string'));
    });
    it('should not accept non-string in playBehavior', () => {
        const directive = Object.assign({}, validDirective, {
            type: AUDIOPLAYER.CLEAR_QUEUE,
            clearBehavior: 1
        });
        delete directive.playBehavior;
        const response = mockResponse([directive]);
        Joi.validate(response, ResponseSchema, (err) => expect(err.details[0].message).to.equal('"clearBehavior" must be a string'));
    });
};
