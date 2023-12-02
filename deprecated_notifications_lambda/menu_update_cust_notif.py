import json
import boto3

def lambda_handler(event, context):
    try:
        event_name = event["Records"][0]["eventName"]
        
        if event_name == "INSERT":
            print("IM INSERT")
        else if event_name == "MODIFY":
            print("IM moify")
        else if event_name == "REMOVE":
            print("IM remove")
            
        # add proper message and subject based on the event_type: insert, modify, remove
        topic_arn = "arn:aws:sns:us-east-1:315128346896:menu-item-update"
        
        client = boto3.client("sns")
        # sample message and subject
        message = "Mutton Biryani price is reduced by $1.49."
        subject = "There's a change in our menu !!"
        
        result = client.publish(TopicArn=topic_arn, Message=message, Subject=subject)
        if result['ResponseMetadata']['HTTPStatusCode'] == 200:
            print(result)
            print("Notification send successfully..!!!")
            return True
    except Exception as e:
        print("Error occured while publish notifications and error is : ", e)
        return false
