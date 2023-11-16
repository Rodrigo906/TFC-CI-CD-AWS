const lambda = require('../../../src/handlers/find-by-id.js');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test find-by-id', () => {
  let mockQuery;

  beforeAll(() => {
    mockQuery = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
  });

  afterAll(() => {
    mockQuery.mockRestore();
  });

  it('Devuelve el usuario especificado por id', async () => {
    const queryResponse = {
      statusCode: 200,
      body: {
        Items: [
          {
            username: 'rodrigo',
            email: 'rodrigo@gmail.com',
            id: 1,
            urlProfile: 'https://example.com/rodrigo',
          },
        ],
        Count: 1,
        ScannedCount: 1,
      },
    };

    // Devuelve el valor especificado cuando se llama a la función query simulada
    mockQuery.mockReturnValue({
      promise: () => Promise.resolve(queryResponse),
    });

    const event = {
      pathParameters: { id: 1 },
    };

    // Invoca la funcion find-by-id()
    const result = await lambda.handler(event);

    const expectedResult = {
      statusCode: 200,
      body: JSON.stringify(queryResponse),
    };

    // Compara el resultado con el resultado esperado
    expect(result).toEqual(expectedResult);
  });
});
