const {
    expect
} = require('chai');
const Joi = require('joi');
const RequestSchema = require('../../schema/RequestSchema');

// Session object for use in testing
const validSession = {
    new: true,
    sessionId: 'testId',
    application: {
        applicationId: 'testAppId'
    },
    attributes: {
        test: 'testAttr'
    },
    user: {
        userId: 'testUserId',
        accessToken: 'testAccessToken'
    }
};

function mockRequest(session = validSession) {
    return {
        version: '1.0',
        session
    };
}

module.exports = () => {
    it('should accept a boolean as a value for new', () => {
        const session = Object.assign({}, validSession, { new: false });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept non-boolean values in new', () => {
        const session = Object.assign({}, validSession, { new: 'true' });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"new" must be a boolean'));
    });
    it('should accept an object in application', () => {
        const session = Object.assign({}, validSession);
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept a non-object for application', () => {
        const session = Object.assign({}, validSession, { application: 1 });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"application" must be an object'));
    });
    it('should enforce that application is required', () => {
        const session = Object.assign({}, validSession, { application: 1 });
        delete session.application;
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"application" is required'));
    });
};
