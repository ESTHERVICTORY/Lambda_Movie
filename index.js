

const request = require('request');
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://dynamodb.us-east-1.amazonaws.com',
    accessKeyId: "AKIAY3FAMQVTEQDV6GCF",
    secretAccessKey: "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"
});
function Dynamodb (title){
    var dynamoClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: 'Movie_Table',
        Item: {
            name: 'Lambda Entry',
            type: 'HTTP',
            title: title,
            timestamp: String(new Date().getTime())
        }
    }

    dynamoClient.put(params, function (err, data) {
        if (err) console.log(err);
        else console.log(data);
    });
};
exports.handler = function (event, context, callback) {
    var title = event.queryStringParameters.title;
    var QueryURL = `https://www.omdbapi.com/?t=${title}&y=&plot=short&apikey=trilogy`;
        Dynamodb(title);
    request(QueryURL, function (err, response, body) {
        if (err) {
            throw err;
        }

        const res= {
            statusCode: 200,
            body: body,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "content-type": "application/json"
            }
        };
        callback(null, res);
    });
};
