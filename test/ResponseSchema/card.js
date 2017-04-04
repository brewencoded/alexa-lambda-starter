const {
    expect
} = require('chai');
const Joi = require('joi');
const ResponseSchema = require('../../schema/ResponseSchema');

function mockResponse(card = { type: 'Simple' }) {
    return {
        version: '1.0',
        response: {
            card
        }
    };
}

module.exports = () => {
    it('should accept a string in type property', () => {
        const response = mockResponse();
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept any other type in type property', () => {
        const response = mockResponse({
            type: 1
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should accept title if type is not LinkAccount', () => {
        const response = mockResponse({
            type: 'Simple',
            title: 'testTitle'
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should accept content if type is not LinkAccount or Standard', () => {
        const response = mockResponse({
            type: 'Simple',
            content: 'testContent'
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept content if type is LinkAccount', () => {
        const response = mockResponse({
            type: 'LinkAccount',
            content: 'test'
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept content if type is Standard', () => {
        const response = mockResponse({
            type: 'Standard',
            content: 'test'
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should accept a string as text value when type is Standard', () => {
        const response = mockResponse({
            type: 'Standard',
            text: 'test'
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept non-string values in text when type is Standard', () => {
        const response = mockResponse({
            type: 'Standard',
            text: 1
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept a text property when type is LinkAccount', () => {
        const response = mockResponse({
            type: 'LinkAccount',
            text: 'test'
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept a text property when type is Simple', () => {
        const response = mockResponse({
            type: 'Simple',
            text: 'test'
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should accept an object as image value when type is Standard', () => {
        const response = mockResponse({
            type: 'Standard',
            image: {
                smallImageUrl:'test'
            }
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept a non object as image value when type is Standard', () => {
        const response = mockResponse({
            type: 'Standard',
            image: 1
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept a image when type is LinkAccount', () => {
        const response = mockResponse({
            type: 'LinkAccount',
            image: {
                smallImageUrl:'test'
            }
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept a image when type is Simple', () => {
        const response = mockResponse({
            type: 'Simple',
            image: {
                smallImageUrl:'test'
            }
        });
        Joi.validate(response, ResponseSchema, (err) => expect(err.name).to.equal('ValidationError'));
    });
};
