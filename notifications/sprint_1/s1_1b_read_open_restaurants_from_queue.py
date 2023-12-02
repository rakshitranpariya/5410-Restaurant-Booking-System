import json
import boto3


def lambda_handler(event, context):
    
    records = event['Records']
    
    open_restaurants_names = ""
    
    for record in records:
        body = record['body']
        json_array = json.loads(body)
        for entry in json_array:
            open_restaurants_names += entry['name']
            open_restaurants_names += "\n"
    
    print(open_restaurants_names)
    
    topic_arn = "arn:aws:sns:us-east-1:315128346896:restaurant_customers"
    
    sns_client = boto3.client("sns")
    
    message = "List of open restaurants are:\n" + open_restaurants_names
    subject = "Restaurants are open for you !!"
    result = sns_client.publish(TopicArn=topic_arn, Message=message, Subject=subject)
    if result['ResponseMetadata']['HTTPStatusCode'] == 200:
        print(result)
        print("Notification send successfully..!!!")
        return True

    return {
        'statusCode': 200,
        'body': json.dumps("Something went wrong")
    }
