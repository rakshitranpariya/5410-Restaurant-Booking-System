import json
import boto3

def lambda_handler(event, context):
    topic_arn = "arn:aws:sns:us-east-1:315128346896:restaurant_owners"
    client = boto3.client("sns")
    
    email_address = event["email"]
    
    filter_policy = {
        'user_email': [email_address]
    }

    subscription_attributes = {
        'FilterPolicy': json.dumps(filter_policy)
    }

    subscribe_response = client.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=email_address,
        Attributes=subscription_attributes
    )
    
    print(subscribe_response)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Subscription done for user' + email_address)
    }
