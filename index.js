const request = require('request');
const aws = require('aws-sdk');

exports.handler = function(event, context, callback) {
    
    var codepipeline = new aws.CodePipeline();
    
    // Retrieve the Job ID from the Lambda action
    var jobId = event["CodePipeline.job"].id;
    
    // Notify AWS CodePipeline of a successful job
    var putJobSuccess = function(message) {
        var params = {
            jobId: jobId
        };
        codepipeline.putJobSuccessResult(params, function(err, data) {
            if(err) {
                context.fail(err);      
            } else {
                context.succeed(message);      
            }
        });
    };
    
    // Notify AWS CodePipeline of a failed job
    var putJobFailure = function(message) {
        var params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(message),
                type: 'JobFailed',
                externalExecutionId: context.invokeid
            }
        };
        codepipeline.putJobFailureResult(params, function(err, data) {
            context.fail(message);      
        });
    };
    
    try {
        
        var params = {
          jobId: jobId
        };
        codepipeline.getJobDetails(params, function(err, obj) {
          if (err) { console.log(err, err.stack) }
          else {
             
              var jobDetailObj = JSON.stringify(obj);
              var jobDetailAsJson = JSON.parse(jobDetailObj);
              
              try{

                  var message = "YOUR MESSAGE HERE";
                  // To pass a message when the Lambda is invoked, use the User Parameter field and uncomment the below line
                  //var message = event["CodePipeline.job"].data.actionConfiguration.configuration.UserParameters;

                  // Appends the Git commit to the end of the message
                  message += ' (' + jobDetailAsJson["jobDetails"].data.inputArtifacts[0].revision.substring(0,8) + ')';
                  
                  request.post('YOUR WEBHOOK HERE', {
                        json: {
                            content: message
                        }
                    }, (error, res, body) => {
                        if (error) {
                            console.error(error);
                            return;
                        }                        
                        putJobSuccess("POST Complete");
                    });
                  
              } catch (f){
                  putJobFailure("Discord POST Failed");
                return;
              }
              
          }    
        });
        
    } catch (e){
        putJobFailure("CodePipeline Failed");
        return;
    }

}