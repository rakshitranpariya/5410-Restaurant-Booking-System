import boto3
import json
import time
from datetime import datetime, timedelta

# {
#   "reservationID": "5pEHYe5wYHWgW20OlAU7",
#   "userID": "0cxWC8OPzqardNFOl6lr",
#   "scheduled_date": "2023-11-19",
#   "scheduled_time": "05:07",
#   "message": "Your reservation is in 30 mins at {Restaurant name}",
#   "email": "u.boonking@gmail.com",
#   "eventType": "INSERT | MODIFY | DELETE"
# }
def lambda_handler(event, context):

    reservationID = event['reservationID']
    userID = event['userID']

    rule_name = reservationID + userID
    

    # Create an EventBridge client
    event_bridge_client = boto3.client('scheduler')

    response = event_bridge_client.delete_schedule(Name=rule_name)

    print(response)

    return {
        'statusCode': 200,
        'body': 'EventBridge rule created successfully.'
    }
