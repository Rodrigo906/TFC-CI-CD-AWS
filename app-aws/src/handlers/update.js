const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableUsers = process.env.TABLE_USERS;

exports.handler = async (event) => {
    const id = event.pathParameters.id;
    const { username, email, urlProfile } = JSON.parse(event.body);

    const queryParams = {
        TableName: tableUsers,
        Key: { id: id }
    };

    try {
        const existingItem = await docClient.get(queryParams).promise();

        // Si el usuario ya existe, se puede realizar la actualización
        if (existingItem.Item) {
            const updateParams = {
                TableName: tableUsers,
                Key: { id: id },
                UpdateExpression: 'set username = :username, email = :email, urlProfile = :urlProfile',
                ExpressionAttributeValues: {
                    ':username': username,
                    ':email': email,
                    ':urlProfile': urlProfile
                }
            };

            await docClient.update(updateParams).promise();

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Usuario actualizado exitosamente' })
            };

        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'El usuario no existe' })
            };
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al actualizar el usuario' })
        };
    }
};