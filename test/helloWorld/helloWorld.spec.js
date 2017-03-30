const {
    expect
} = require('chai');
const sinon = require('sinon');
const { helloWorld } = require('../../fn/helloWorld.js');

describe('helloWorld()', () => {
    it('should be a function', () => {
        expect(helloWorld).to.be.a('function');
    });
    it('should invoke a callback function', () => {
        const callback = sinon.spy();
        helloWorld(callback);
        expect(callback.called).to.be.true;
    });
    it('should invoke a callback function only once', () => {
        const callback = sinon.spy();
        helloWorld(callback);
        expect(callback.calledOnce).to.be.true;
    });
    it('should invoke callback with 2 args', () => {
        const callback = sinon.spy();
        helloWorld(callback);
        expect(callback.calledWith(null, {
            'version': '1.0',
            'response': {
                'outputSpeech': {
                    'type': 'PlainText',
                    'text': 'Hello World'
                },
                'shouldEndSession': true
            }
        }));
    });
});
