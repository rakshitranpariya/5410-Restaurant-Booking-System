import json
import boto3

def lambda_handler(event, context):
    
    records = event["Records"]

    for record in records:
        eventName = record['eventName']

        if eventName == "INSERT":
            new_image = record['dynamodb']['NewImage']
            
            current_status = new_image["Availability"]["BOOL"]
            restaurant_email = new_image["restaurantEmail"]["S"]
            
            if current_status == False:
                message = "Your restaurant is overbooked!!"
                send_sns_notification(message, restaurant_email)
        
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def send_sns_notification(message, email):
    topic_arn = "arn:aws:sns:us-east-1:315128346896:restaurant_customers"
    client = boto3.client("sns")
    subject = "Restaurant availability update"
    
    message_attributes = {
    'user_email': {
                'DataType': 'String',
                'StringValue': email
        }
    }
    
    result = client.publish(TopicArn=topic_arn, Message=message, Subject=subject, message_attributes = message_attributes)
    
    if result['ResponseMetadata']['HTTPStatusCode'] == 200:
        print(result)
        print("Notification sent successfully..!!!")
        return True
    else:
        print("Error occurred while publishing notifications and error is:", result)
        return False
