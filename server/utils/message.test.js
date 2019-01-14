var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

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

describe (' generateLocationMessage', ()=>{
    it('Should generate the correct location message object', ()=> {
        const from = 'Admin';
        const lat = '3';
        const long = '4';

        var generatedMessageObj = generateLocationMessage(from, lat, long);
        expect(generatedMessageObj.from).toBe(from);
        expect(generatedMessageObj.url).toBe(`https://www.google.com/maps?q=${lat},${long}`);
        expect(generatedMessageObj.createdAt).toBeA('number');
    })
});
