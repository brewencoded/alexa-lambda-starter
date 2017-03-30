const {
    expect
} = require('chai');
const Joi = require('joi');
const Request = require('../../schema/ResponseSchema');

module.exports = () => {
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
        (err) => expect(err).to.be.null);
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
        (err) => expect(err.name).to.equal('ValidationError'));
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
        (err) => expect(err).to.be.null);
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
        (err) => expect(err).to.be.null);
    });
    it('should not accept content if type is LinkAccount', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'LinkAccount',
                    content: 'test'
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept content if type is Standard', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'Standard',
                    content: 'test'
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should accept a string as text value when type is Standard', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'Standard',
                    text: 'test'
                }
            }
        },
        Request,
        (err) => expect(err).to.be.null);
    });
    it('should not accept non-string values in text when type is Standard', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'Standard',
                    text: 1
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept a text property when type is LinkAccount', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'LinkAccount',
                    text: 'test'
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept a text property when type is Simple', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'Simple',
                    text: 'test'
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should accept an object as image value when type is Standard', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'Standard',
                    image: {
                        smallImageUrl:'test'
                    }
                }
            }
        },
        Request,
        (err) => expect(err).to.be.null);
    });
    it('should not accept a non object as image value when type is Standard', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'Standard',
                    image: 1
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept a image when type is LinkAccount', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'LinkAccount',
                    image: 1
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
    it('should not accept a image when type is Simple', () => {
        Joi.validate({
            version: '1.0',
            response: {
                card: {
                    type: 'Simple',
                    image: 1
                }
            }
        },
        Request,
        (err) => expect(err.name).to.equal('ValidationError'));
    });
};
