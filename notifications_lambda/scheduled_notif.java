import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.PublishRequest;
import com.amazonaws.services.sns.model.PublishResult;

public class EmailNotificationLambda implements RequestHandler<Object, String> {

    // Replace with your SNS topic ARN
    private static final String SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:315128346896:menu-item-update";

    @Override
    public String handleRequest(Object input, Context context) {
        
        AmazonSNS snsClient = AmazonSNSClientBuilder.defaultClient();

        String message = "restaurant offers";
        PublishRequest publishRequest = new PublishRequest(SNS_TOPIC_ARN, message);

        try {
            PublishResult publishResult = snsClient.publish(publishRequest);
            return "Email notification sent. Message ID: " + publishResult.getMessageId();
        } catch (Exception e) {
            return "Error sending email notification: " + e.getMessage();
        }
    }
}
