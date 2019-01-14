var expect = require('expect');

var {generateMessage} = require('./message');

describe (' generateMessage', ()=>{
    it('Should generate the correct message object', ()=> {
        const from = 'Angela';
        const message = 'text messsage';

        var generatedMessageObj = generateMessage(from,message);
        expect(generatedMessageObj.from).toBe(from);
        expect(generatedMessageObj.text).toBe(message);
        expect(generatedMessageObj.createdAt).toBeA('number');
    })
});
