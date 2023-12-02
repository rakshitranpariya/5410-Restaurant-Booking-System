import json
import boto3

def lambda_handler(event, context):
    # customer email, restaurant name
    print(event)
    
    message = event["message"]
    email = event['email']
    
    send_sns_notification(message,email)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


def send_sns_notification(message, email):
    topic_arn = "arn:aws:sns:us-east-1:315128346896:restaurant_customers"
    client = boto3.client("sns")
    subject = "Restaurant booking in 30 mins"
    message_attributes = {
    'user_email': {
                'DataType': 'String',
                'StringValue': email
        }
    }
    result = client.publish(TopicArn=topic_arn, Message=message, Subject=subject, MessageAttributes=message_attributes)
    
    if result['ResponseMetadata']['HTTPStatusCode'] == 200:
        print(result)
        print("Notification sent successfully..!!!")
        return True
    else:
        print("Error occurred while publishing notifications and error is:", result)
        return False
