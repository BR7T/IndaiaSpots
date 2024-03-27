const { hashPassword } = require('./api/middleware/bcrypt/hashing');

test('Hashing Password', () => {
    return hashPassword("MatheusSilva123",12).then(hash => {
        expect(hash.substring(0,7) == '$2b$12$' && hash.split('').length === 60).toBeTruthy();
    })
})

