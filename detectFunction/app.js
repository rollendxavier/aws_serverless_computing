//Use this function to detect a text from the image uploaded into S3 Bucket
'use strict'

const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
var rekognition = new AWS.Rekognition();

console.log('Calling lmabda function detect with arguments');

// Lambda function entry point
exports.handler = async (event) => {
  return await processImage(event)
}

//function which will extract the text from S3 bucket image
const processImage = async function (event) {

  try {
    var params = {
      Image: {
        S3Object: {
          Bucket: process.env.UploadBucket,
          Name: event['queryStringParameters'].Image
        }
      },
    };
    
    let data = await rekognition.detectText(params).promise();
    
    var table = '<table><tr><th>#</th><th>Text</th><th>Confidence</th><th>Parent</th><th>Type</th></tr>';
        // show each text data detected
        for (var i = 0; i < data.TextDetections.length; i++) {
          table += 
          '<tr><td>' + data.TextDetections[i].Id + '</td>'+
          '<td>' + data.TextDetections[i].DetectedText + '</td>' +
          '<td>' + data.TextDetections[i].Confidence + '</td>' +
          '<td>' + data.TextDetections[i].ParentId + '</td>'+
          '<td>' + data.TextDetections[i].Type + '</td></tr>'
        }
        table += '</table>';
        const response = {
          statusCode: 200,
          body: table
        }
        return response;
    
  } catch (error) {
    console.log(error);
    return error;
  }
}