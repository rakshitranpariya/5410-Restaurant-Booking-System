import boto3

topic_arn = "arn:aws:sns:us-east-1:315128346896:menu-update" 
# update to actual SNS topic

def send_sns(message, subject):
    try:
        client = boto3.client("sns")
        result = client.publish(TopicArn=topic_arn, Message=message, Subject=subject)
        if result['ResponseMetadata']['HTTPStatusCode'] == 200:
            print(result)
            print("Notification send successfully..!!!")
            return True
    except Exception as e:
        print("Error occured while publish notifications and error is : ", e)
        return True

def lambda_handler(event, context):
        subject = "test sub"
        message = "hi"
        SNSResult = send_sns(message, subject)
        if SNSResult :
            print("Notification Sent..") 
            return SNSResult
        else:
            return False