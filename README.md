# aws-lambda-to-discord
A Node.js-based Lambda function that is used to make an HTTP POST call to a Discord Webhook during CodePipeline execution

This function is simple to use and if you are trying to go really fast (and know what you are doing) all you need to do is update the webhook url and the message you want to post to Discord and then create the Lambda function. If you're looking for some additional details, keep reading.

### CodePipeline Setup
There are a few ways to setup CodePipeline to use this function. The easiest way is to create a new Stage within a Pipeline named 'Discord.' If you aren't familiar with CodePipeline setup, there are a number of guides on the AWS site that are worth reading through. With your new stage setup, add an Action Group. I call mine 'Notify Discord' and select 'AWS Lambda' under the invoke section. After the expanded input form builds, select your lambda function under the function name section.

*Note*: The Input/Output Artifacts can be used if you are passing files to and from other systems during the execution of the pipeline. There are a lot of use cases there that go beyond this ReadMe.

#### User Parameters
The User Parameters section allows you to specify a string to send to Lambda that can be used as a part of your processing. It could be used to send a full message like 'This is the message I want to post' or it can be something more easily split like 'this,type,of,message.' I have used both approaches to help pass data into the function at execution time.
