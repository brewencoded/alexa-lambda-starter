const {
    expect
} = require('chai');
const Joi = require('joi');

const {
    INTENT_REQUEST,
    LAUNCH_REQUEST,
    SESSION_ENDED_REQUEST
} = require('../../constants/SchemaConstants');
const RequestSchema = require('../../schema/RequestSchema');

// Request object for use in testing
const baseRequest = {
    type: LAUNCH_REQUEST,
    requestId: 'testId',
    timestamp: 'testTimestamp',
    locale: 'testLocale'
};
const validIntentRequest = Object.assign({}, baseRequest, {
    type: INTENT_REQUEST,
    intent: {
        name: 'testName',
        slots: {
            testSlotKey: {
                name: 'testSlotKey',
                value: 'testSlotValue'
            }
        }
    }
});
const validLaunchRequest = Object.assign({}, baseRequest, {
    type: LAUNCH_REQUEST
});
const validSessionEndedRequest = Object.assign({}, baseRequest, {
    type: SESSION_ENDED_REQUEST,
    reason: 'testReason',
    error: {
        type: 'testErrorType',
        message: 'testErrorMessage'
    }
});

function mockRequest(request = baseRequest) {
    return {
        version: '1.0',
        request
    };
}

module.exports = () => {
    it('should accept a valid request', () => {
        const request = mockRequest();
        Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
    });
    it('should only accept strings as type', () => {
        const base = Object.assign({}, baseRequest, {
            type: 1
        });
        const request = mockRequest(base);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"type" must be a string'));
    });
    it('should require type', () => {
        const base = Object.assign({}, baseRequest);
        delete base.type;
        const request = mockRequest(base);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"type" is required'));
    });
    it('should not accept a value that isn\'t whitelisted in type', () => {
        const base = Object.assign({}, baseRequest, {
            type: 'forbidden'
        });
        const request = mockRequest(base);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"type" must be one of [INTENT_REQUEST, SESSION_ENDED_REQUEST, LAUNCH_REQUEST]'));
    });
    it('should require requestId to be a string', () => {
        const base = Object.assign({}, baseRequest, {
            type: LAUNCH_REQUEST,
            requestId: 1
        });
        const request = mockRequest(base);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"requestId" must be a string'));
    });
    it('should require timestamp to be a string', () => {
        const base = Object.assign({}, baseRequest, {
            type: LAUNCH_REQUEST,
            timestamp: 1
        });
        const request = mockRequest(base);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"timestamp" must be a string'));
    });
    it('should require locale to be a string', () => {
        const base = Object.assign({}, baseRequest, {
            type: LAUNCH_REQUEST,
            locale: 1
        });
        const request = mockRequest(base);
        Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"locale" must be a string'));
    });
    describe('Launch request', () => {

    });
    describe('Intent request', () => {

    });
    describe('Session ended request', () => {

    });
};
