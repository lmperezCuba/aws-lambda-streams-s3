const util = require('util');
const stream = require('stream');
const { Readable } = stream;
const pipeline = util.promisify(stream.pipeline);

const { S3 } = require("@aws-sdk/client-s3");
const s3 = new S3({ region: 'eu-north-1' });

exports.handler = awslambda.streamifyResponse(async (event, responseStream, context) => {
    const params = {
        Bucket: "aws-training-soaint",
        Key: "algoritms.pdf"
    };
    console.log("Streaming PDF file using S3 createReadStream");
    const requestStream = (await s3.getObject(params)).Body;
    const metadata = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/pdf",
        }
    };
    console.log("Streaming PDF file to client via function URL");
     responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);
     await pipeline(requestStream, responseStream);
});