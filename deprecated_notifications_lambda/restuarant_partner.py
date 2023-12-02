import json

def lambda_handler(event, context):
    
    records = event["Records"]

    for record in records:
        body = json.loads(record["body"])

        if body["eventType"] == "INSERT":
            # do nothing
        elif body["eventType"] == "MODIFY":
            new_image = record['dynamodb']['NewImage']
            
            
            current_status = new_image["current_status"]["S"]
            name = new_image["name"]["S"]

            # todo: create a mssg with restaurant name and current status
            message = name + " is " + current_status + "."


            
            message = "The restaurant is " + current_status + "."
            send_sns_notification(message)
        elif body["eventType"] == "REMOVE":
            # do nothing
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
        print("Notification send successfully..!!!")
        return True
    else:
        print("Error occurred while publishing notifications and error is:", e)
        return False