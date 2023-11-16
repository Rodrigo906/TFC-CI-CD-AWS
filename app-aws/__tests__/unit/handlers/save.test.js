const lambda = require('../../../src/handlers/save.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test de creacion de usuario exitoso', () => {
    let mockPut;
    let mockGet;

    beforeAll(() => {
        mockPut = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
        mockGet = jest.spyOn(dynamodb.DocumentClient.prototype, 'get');
    });

    afterAll(() => {
        mockPut.mockRestore();
        mockGet.mockRestore();
    });

    it('Deberia crear un nuevo usuario', async () => {
        mockGet.mockReturnValue({
            promise: () => Promise.resolve({}),
        });

        mockPut.mockReturnValue({
            promise: () => Promise.resolve({}),
        });

        const event = {
            body: JSON.stringify({
                id: 1,
                username: 'Rodrigo',
                email: 'rodrigo@gmail.com',
                urlProfile: 'https://example.com/rodrigo',
            }),
        };

        const result = await lambda.handler(event);

        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify({ message: 'Usuario cargado exitosamente' }),
        };

        expect(result).toEqual(expectedResult);
    });
});
