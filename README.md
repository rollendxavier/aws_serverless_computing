# AWS: Serverless application to read text in an image (S3)

This application is used to upload an image into S3 bucket using S3 signed url and later process the uploaded image using lambda functions and Amazon Rekognition to extract the text. This can be tested using a frontend application created using Vue and node.js

To find more about the application refer here https://www.linkedin.com/pulse/aws-serverless-computing-faas-application-using-lambda-rollend-xavier/

## Requirements

* [AWS CLI](https://aws.amazon.com/cli/) installed and configured with your environment
* [AWS SAM CLI installed](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) - minimum version 0.48.
* [NodeJS 12.x installed](https://nodejs.org/en/download/)

## Installation Instructions

1. Navigate to the repo https://github.com/rollendxavier/vehicle_detection 
2. Clone the repo onto your local development machine using `git clone`.

### Installing the application

The complete deployment can be executed using the [AWS SAM (Serverless application model)](https://aws.amazon.com/serverless/sam/) and template (template.yaml) available in the repo.

```
cd .. 
sam deploy --guided
```
This command will be creating below set of components into your AWS using CloudFormation and should be carefull to consider your AWS billing limits.
```
CloudFormation stack changeset
--------------------------------------------------------------------------------------------------------------------
Operation                          LogicalResourceId                  ResourceType                       Replacement
--------------------------------------------------------------------------------------------------------------------
+ Add                              ImageDetectFunctionDetecteApiEve   AWS::Lambda::Permission            N/A
                                   ntPermission
+ Add                              ImageDetectFunctionRole            AWS::IAM::Role                     N/A
+ Add                              ImageDetectFunction                AWS::Lambda::Function              N/A
+ Add                              ImageUploadFunctionRole            AWS::IAM::Role                     N/A
+ Add                              ImageUploadFunctionUploadApiEven   AWS::Lambda::Permission            N/A
                                   tPermission
+ Add                              ImageUploadFunction                AWS::Lambda::Function              N/A
+ Add                              S3ImageBucket                      AWS::S3::Bucket                    N/A
+ Add                              VehicleDetetctionApiApiGatewayDe   AWS::ApiGatewayV2::Stage           N/A
                                   faultStage
+ Add                              VehicleDetetctionApi               AWS::ApiGatewayV2::Api             N/A
--------------------------------------------------------------------------------------------------------------------

```
When using --guided, SAM will prompt for basic parameters, enter:
- Stack Name: s3TextDetection
- AWS Region: your preferred AWS Region (e.g. ap-southeast-2)
- Accept all other defaults.

Once the deployment is finished, not the below output parameters as it is required to configure the frontend application.

- The APIendpoint value output will looks like https://abc12345678.execute-api.ap-southeast-2.amazonaws.com.
- **The upload URL endpoint** is with /uploads route added - for example: https://abc12345678.execute-api.us-west-2.amazonaws.com/uploads.
- **The detect URL endpoint** is with the /detect route added - for example: https://abc12345678.execute-api.us-west-2.amazonaws.com/detect.

### Application demo using the frontent application (Vue.js)

The Vue.js frontend app is saved in the `frontend` directory. 

1. You have to configure the API Gateway endpoint from the backend deployment in the `index.html` file.

2. You will not be able to run this from your local browser, as CORS policy works with localhost. You can follow below steps 
    - Copy the file to an S3 bucket and allow the policies (ACL) to make it public
    ```
    aws s3 cp frontend\index.html s3://s3bucket-vehicledetection

    aws s3api put-object-acl --bucket s3bucket-vehicledetection --key index.html --acl public-read-write

    ```
    - or [deploy using AWS Amplify Console](https://aws.amazon.com/amplify/console/).

3. Once the page is loaded on a browser, try uploding a vehicle image which displays a rego (any image with text also works) and the application will upload the image into an S3 bucket and diplays the text in the uploaded image.