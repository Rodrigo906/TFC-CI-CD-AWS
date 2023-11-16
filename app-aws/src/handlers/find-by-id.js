const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableUsers = process.env.TABLE_USERS;

exports.handler = async (event) => {

    let id = event.pathParameters.id;
    
    const params = {
        TableName: tableUsers,
        KeyConditionExpression: 'id = :value',
        ExpressionAttributeValues: {
            ':value': id
        }
    };
    
    return {
        statusCode: 200,
        body: JSON.stringify(await docClient.query(params).promise())
    }
};

