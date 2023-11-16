const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableUsers = process.env.TABLE_USERS;

exports.handler = async (event) => {

    const params = {
        TableName: tableUsers
    };

    return {
        statusCode: 200,
        body: JSON.stringify(await docClient.scan(params).promise())
    }
};
