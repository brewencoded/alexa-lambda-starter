const {
    expect
} = require('chai');
const Joi = require('joi');
const Request = require('../../schema/RequestSchema');

// Session object for use in testing
const Session = {
    create(override = {}) {
        const instance = Object.create(this);
        // set here to prevent them from being added to prototype and invisible on log/dir
        instance.new = override.new || true,
        instance.sessionId = override.sessionId || 'testId',
        instance.application  = override.application || {
            applicationId: 'testAppId'
        };
        instance.attributes = override.attributes || {
            test: 'testAttr'
        };
        instance.user = override.user || {
            userId: 'testUserId',
            accessToken: 'testAccessToken'
        };
        return instance;
    }
};

module.exports = () => {
    it('should accept a boolean as a value for new', () => {
        const session = Session.create({
            new: false
        });
        validate(session, (err) => {
            expect(err).to.be.null;
        });
    });
    it('should not accept non-boolean values in new', () => {
        const session = Session.create({
            new: 'true'
        });
        validate(session, (err) => {
            expect(err.details[0].message).to.equal('"new" must be a boolean');
        });
    });
    it('should accept an object in application', () => {
        const session = Session.create();
        validate(session, (err) => {
            expect(err).to.be.null;
        });
    });
    it('should not accept a non-object for application', () => {
        const session = Session.create({
            application: 1
        });
        validate(session, (err) => {
            expect(err.details[0].message).to.equal('"application" must be an object');
        });
    });
    it('should enforce that application is required', () => {
        const session = Session.create();
        delete session.application;
        validate(session, (err) => {
            expect(err.details[0].message).to.equal('"application" is required');
        });
    });
};

function validate(session, callback) {
    Joi.validate({
        version: '1.0',
        session
    },
    Request,
    callback);
}
