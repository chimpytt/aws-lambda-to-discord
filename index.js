const request = require('request');
const aws = require('aws-sdk');

exports.handler = function (event, context, callback) {

    // If you want to use the User Parameters, uncomment this next line. Refer to the ReadMe for more details.
    //var userParameters = event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;
    var message = 'YOUR DISCORD MESSAGE HERE';

    request.post('YOUR DISCORD WEBHOOK HERE', {
        json: {
            content: message
        }
    }, (error, res, body) => {

        console.log(`Discord POST Response StatusCode: ${res.statusCode}`);

        var codepipeline = new aws.CodePipeline();
        var jobId = event["CodePipeline.job"].id;

        // Notify AWS CodePipeline of a successful job
        var putJobSuccess = function (message) {
            var params = {
                jobId: jobId
            };
            codepipeline.putJobSuccessResult(params, function (err, data) {
                if (err) {
                    context.fail(err);
                } else {
                    context.succeed(message);
                }
            });
        };

        // Notify AWS CodePipeline of a failed job
        var putJobFailure = function (message) {
            var params = {
                jobId: jobId,
                failureDetails: {
                    message: JSON.stringify(message),
                    type: 'JobFailed',
                    externalExecutionId: context.invokeid
                }
            };
            codepipeline.putJobFailureResult(params, function (err, data) {
                context.fail(message);
            });
        };

        if (error) {
            putJobFailure("Discord Webhook Failed");
            return;
        }

        putJobSuccess("Discord Webhook Completed");

    });
}