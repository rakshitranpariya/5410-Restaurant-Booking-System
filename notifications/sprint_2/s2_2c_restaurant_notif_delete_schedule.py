import json
import boto3


def lambda_handler(event, context):
    reservationId = event["reservationId"]
    
    event_bridge_client = boto3.client('scheduler')
    
    response = event_bridge_client.delete_schedule(
        Name=reservationId
    )
    
    print(response)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
