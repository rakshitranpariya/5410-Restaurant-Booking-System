import json
import boto3

def lambda_handler(event, context):
    try:
        topic_arn = "arn:aws:sns:us-east-1:215753046701:menu-item-update"
        
        client = boto3.client("sns")
        # sample message and subject
        message = "Admin's message"
        subject = "Admin's email subject"
        
        result = client.publish(TopicArn=topic_arn, Message=message, Subject=subject)
        if result['ResponseMetadata']['HTTPStatusCode'] == 200:
            print(result)
            print("Notification send successfully..!!!")
            return True
    except Exception as e:
        print("Error occured while publish notifications and error is : ", e)
        return false
