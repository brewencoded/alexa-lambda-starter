const {
    expect
} = require('chai');
const Joi = require('joi');

const {
    PLAYER_ACTIVITY
} = require('../../constants/SchemaConstants');
const RequestSchema = require('../../schema/RequestSchema');

// Context object for use in testing
const validContext = {
    System: {
        application: {
            applicationId: 'testId'
        },
        user: {
            userId: 'testUserId',
            accessToken: 'testAccessToken'
        },
        device: {
            supportedInterfaces: {
                AudioPlayer: {}
            }
        }
    },
    AudioPlayer: {
        token: 'testToken',
        offsetInMilliseconds: 0,
        playerActivity: PLAYER_ACTIVITY.IDLE
    }
};

function mockRequest(context = validContext) {
    return {
        version: '1.0',
        context
    };
}

module.exports = () => {
    describe('System', () => {
        it('should accept an object as application', () => {
            const context = Object.assign({}, validContext);
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
        });
        it('should not accept a non-object as application', () => {
            const context = Object.assign({}, validContext, {
                System: {
                    application: 1
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"application" must be an object'));
        });
        it('should expect an applicationId in application', () => {
            const context = Object.assign({}, validContext, {
                System: {
                    application: {}
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"applicationId" is required'));
        });
        it('should not accept a non-object as user', () => {
            const context = Object.assign({}, validContext, {
                System: {
                    user: 1
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"user" must be an object'));
        });
        it('should expect a userId in user', () => {
            const context = Object.assign({}, validContext, {
                System: {
                    user: {}
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"userId" is required'));
        });
        it('should treat accessToken as optional in user', () => {
            const context = Object.assign({}, validContext);
            delete context.System.user.accessToken;
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
        });
        it('should not accept a non-object as device', () => {
            const context = Object.assign({}, validContext, {
                System: {
                    device: 1
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"device" must be an object'));
        });
    });
    describe('AudioPlayer', () => {
        it('should accept a valid AudioPlayer', () => {
            const context = Object.assign({}, validContext);
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err).to.be.null);
        });
        it('should not accept a non-object as AudioPlayer', () => {
            const context = Object.assign({}, validContext, {
                AudioPlayer: 1
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"AudioPlayer" must be an object'));
        });
        it('should not accept a non-string as token', () => {
            const context = Object.assign({}, validContext, {
                AudioPlayer: {
                    token: 1
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"token" must be a string'));
        });
        it('should not accept a non-number as offsetInMilliseconds', () => {
            const context = Object.assign({}, validContext, {
                AudioPlayer: {
                    offsetInMilliseconds: 'forbidden'
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"offsetInMilliseconds" must be a number'));
        });
        it('should not accept a non-string as playerActivity', () => {
            const context = Object.assign({}, validContext, {
                AudioPlayer: {
                    playerActivity: 1
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"playerActivity" must be a string'));
        });
        it('should not accept a value that isn\'t whitelisted in playerActivity', () => {
            const context = Object.assign({}, validContext, {
                AudioPlayer: {
                    playerActivity: 'forbidden'
                }
            });
            const request = mockRequest(context);
            Joi.validate(request, RequestSchema, (err) => expect(err.details[0].message).to.equal('"playerActivity" must be one of [IDLE, PAUSED, PLAYING, BUFFER_UNDERRUN, FINISHED, STOPPED]'));
        });
    });
};
