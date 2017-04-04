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
        it('should accept a type of LaunchRequest', () => {
            const launch = Object.assign({}, validLaunchRequest);
            const request = mockRequest(launch);
            Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
        });
    });
    describe('Intent request', () => {
        it('should accept a type of IntentRequest', () => {
            const intent= Object.assign({}, validIntentRequest);
            const request = mockRequest(intent);
            Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
        });
        it('should require intent when type is IntentRequest', () => {
            const intent= Object.assign({}, validIntentRequest);
            delete intent.intent;
            const request = mockRequest(intent);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"intent" is required'));
        });
        it('should require intent to be an object', () => {
            const intent = Object.assign({}, validIntentRequest, {
                intent: 1
            });
            const request = mockRequest(intent);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"intent" must be an object'));
        });
        it('should require intent.name to be a string', () => {
            const intent = Object.assign({}, validIntentRequest, {
                intent: {
                    name: 1
                }
            });
            const request = mockRequest(intent);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"name" must be a string'));
        });
        it('should require intent.name', () => {
            const intent = Object.assign({}, validIntentRequest);
            delete intent.intent.name;
            const request = mockRequest(intent);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"name" is required'));
        });
        it('should require intent.slots to be an object', () => {
            const intent = Object.assign({}, validIntentRequest, {
                intent: {
                    name: 'testName',
                    slots: 1
                }
            });
            const request = mockRequest(intent);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"slots" must be an object'));
        });
    });
    describe('Session ended request', () => {
        
    });
};
