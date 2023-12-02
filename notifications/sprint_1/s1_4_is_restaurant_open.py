import json
import boto3

def lambda_handler(event, context):
    
    records = event["Records"]

    for record in records:
        eventName = record['eventName']

        if eventName == "INSERT":
            # do nothing
            pass
        elif eventName == "MODIFY":
            new_image = record['dynamodb']['NewImage']
            
            current_status = new_image["current_status"]["S"]
            name = new_image["name"]["S"]
            message = name + " is " + current_status + "."
            send_sns_notification(message)
        elif eventName == "REMOVE":
            # do nothing
            pass
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

def send_sns_notification(message):
    topic_arn = "arn:aws:sns:us-east-1:315128346896:restaurant_open_topic"
    client = boto3.client("sns")
    subject = "Restaurant status update"
    result = client.publish(TopicArn=topic_arn, Message=message, Subject=subject)
    
    if result['ResponseMetadata']['HTTPStatusCode'] == 200:
        print(result)
        print("Notification sent successfully..!!!")
        return True
    else:
        print("Error occurred while publishing notifications and error is:", result)
        return False
    