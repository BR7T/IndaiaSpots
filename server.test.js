//const hashing = require('./hashPassword');
const bcrypt  = require('bcrypt');
const { hashPassword } = require('./server');

test('Hashing Password', () => {
    return hashPassword("MatheusSilva123",12).then(hash => {
        expect(hash.substring(0,7) == '$2b$12$' && hash.split('').length == 60).toBeTruthy();
    })
})

