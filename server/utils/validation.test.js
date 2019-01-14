var {isRealString}  = require('./validation');
var expect = require('expect');

describe('isRealString', ()=>{
    it('Should be real string', ()=>{
        expect(isRealString('Angela')).toBeTruthy();
        expect(isRealString('Angela     ')).toBeTruthy();
    });

    it('Should not be real string', ()=>{
        expect(isRealString('')).toBeFalsy();
        expect(isRealString('     ')).toBeFalsy();
    });
});