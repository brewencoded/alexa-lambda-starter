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
    it('should accept a string as a value for sessionId', () => {
        const session = Object.assign({}, validSession, { sessionId: 'testSessionId' });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept non-string values in sessionId', () => {
        const session = Object.assign({}, validSession, { sessionId: 1 });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"sessionId" must be a string'));
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
    it('should not accept an object with keys other than applicationId in application', () => {
        const session = Object.assign({}, validSession, {
            application: {
                applicationId: 'testId',
                test: 'testForbidden'
            }
        });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"test" is not allowed'));
    });
    it('should not accept an object without applicationId property in application', () => {
        const session = Object.assign({}, validSession, {
            application: {
            }
        });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"applicationId" is required'));
    });
    it('should accept an object in attributes', () => {
        const session = Object.assign({}, validSession);
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
    });
    it('should not accept a non-object for attributes', () => {
        const session = Object.assign({}, validSession, { attributes: 1 });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"attributes" must be an object'));
    });
    it('should enforce that attributes is required', () => {
        const session = Object.assign({}, validSession);
        delete session.attributes;
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"attributes" is required'));
    });

    it('should not accept a non-object for user', () => {
        const session = Object.assign({}, validSession, { user: 1 });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"user" must be an object'));
    });
    it('should enforce that user is required', () => {
        const session = Object.assign({}, validSession);
        delete session.user;
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"user" is required'));
    });
    it('should not accept an object with keys other than userId and accessToken in user', () => {
        const session = Object.assign({}, validSession, {
            user: {
                test: 'testForbidden',
                userId: 'testUserId',
                accessToken: 'testAccessToken'
            }
        });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"test" is not allowed'));
    });
    it('should not accept an object without userId property in user', () => {
        const session = Object.assign({}, validSession, {
            user: {
                accessToken: 'testAccessToken'
            }
        });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"userId" is required'));
    });
    it('should accept an object without accessToken property in user', () => {
        const session = Object.assign({}, validSession, {
            user: {
                userId: 'testUserId',
            }
        });
        const request = mockRequest(session);
        Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
    });
};
