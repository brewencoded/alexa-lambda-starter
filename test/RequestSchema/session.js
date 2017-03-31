const {
    expect
} = require('chai');
const Joi = require('joi');
const Request = require('../../schema/RequestSchema');

// Session object for use in testing
const Session = {
    create(override) {
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
        Joi.validate({
            version:'1.0',
            session
        },
        Request,
        (err) => {
            expect(err).to.be.null;
        });
    });
    it('should not accept non-boolean values in new', () => {
        const session = Session.create({
            new: 'true'
        });
        Joi.validate({
            version:'1.0',
            session
        },
        Request,
        (err) => {
            expect(err.details[0].message).to.equal('"new" must be a boolean');
        });
    });
};
