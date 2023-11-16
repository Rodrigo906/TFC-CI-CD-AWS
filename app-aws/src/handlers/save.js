const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableUsers = process.env.TABLE_USERS;

exports.handler = async (event) => {
    const { id, username, email, urlProfile } = JSON.parse(event.body);
    
    const queryParams = {
        TableName: tableUsers,
        Key: { id: id }
    };

    try {
        const existingItem = await docClient.get(queryParams).promise();

        if (existingItem.Item) {
            return {
                statusCode: 409,
                body: JSON.stringify({ message: 'El usuario ya existe' })
            };
        }

        const putParams = {
            TableName: tableUsers,
            Item: {
                id: id,
                username: username,
                email: email,
                urlProfile: urlProfile
            }
        };

        await docClient.put(putParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Usuario cargado exitosamente' })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al guardar' })
        };
    }
};