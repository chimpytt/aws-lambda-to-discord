# aws-lambda-to-discord
A Node.js-based Lambda function that is used to make an HTTP POST call to a Discord Webhook during CodePipeline execution

This function is simple to use and if you are trying to go really fast (and know what you are doing) all you need to do is update the webhook url and the message you want to post to Discord and then create the Lambda function. If you're looking for some additional details, keep reading.


### IAM Setup
IAM setup requires a single policy and role. Within the IAM console, create a new policy and copy the JSON from the resources/iam.json file. This policy came straight from the AWS documentation and is setup to allow Lambda to interact with CloudWatch. With the policy created, define a new role (I call mine 'LambdaCodePipelineExec') and attach this single policy. No other policies are needed on the role to allow this function to work.


### Discord Setup
Creating a new Webhook in Discord is really simple. Click on the 'Settings' icon next to the Channel you want to post to, select Webhooks, and then create a new Webhook. Copy the url path for the Webhook and update the index.js file with the copied url.


### Function Creation
Create a new Lambda function with the Node.js 10.x runtime. To populate the function, select the "upload from zip" option for 'Code Entry Type' and upload a zipped package of the node_modules directory and index.js. **IMPORTANT**: These must be in the root directory of the Lambda function or it will not work. Once uploaded you can drag to organize if you need to. For the function's execution role, select the role created in the IAM Setup section. I left all other settings at default.


### CodePipeline Setup
There are a few ways to setup CodePipeline to use this function. The easiest way is to create a new Stage within a Pipeline named 'Discord.' If you aren't familiar with CodePipeline setup, there are a number of guides on the AWS site that are worth reading through. With your new stage setup, add an Action Group. I call mine 'Notify Discord' and select 'AWS Lambda' under the invoke section. After the expanded input form builds, select your lambda function under the function name section.

*Note*: The Input/Output Artifacts can be used if you are passing files to and from other systems during the execution of the pipeline. There are a lot of use cases there that go beyond this ReadMe.

#### User Parameters
The User Parameters section allows you to specify a string to send to Lambda that can be used as a part of your processing. It could be used to send a full message like 'This is the message I want to post' or it can be something more easily split like 'this,type,of,message.' I have used both approaches to help pass data into the function at execution time.

### Conclusion
With the above created, you should be able to run your pipeline and post to the target Discord Channel. 
