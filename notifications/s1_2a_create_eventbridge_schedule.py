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

    lambda_function_arn = 'arn:aws:lambda:us-east-1:315128346896:function:notify_cust_30_min_before_reservation'

    scheduled_date = event['scheduled_date']
    scheduled_time = event['scheduled_time']
    reservationID = event['reservationID']
    userID = event['userID']

    rule_name = reservationID + userID
    
    datetime_str = f"{scheduled_date} {scheduled_time}"
    original_datetime = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")

    result_datetime = original_datetime - timedelta(minutes=30)

    result_str = result_datetime.strftime("%Y-%m-%d %H:%M")
    
    result_datetime = datetime.strptime(result_str, "%Y-%m-%d %H:%M")

    # Extract individual components
    year = result_datetime.year
    month = result_datetime.month
    day = result_datetime.day
    hour = result_datetime.hour
    minutes = result_datetime.minute
    
    year_str = str(year)
    month_str = str(month).zfill(2)
    day_str = str(day).zfill(2)
    hour_str = str(hour).zfill(2)
    minute_str = str(minutes).zfill(2) 

    
    message = event['message']
    email = event['email']
    
    existing_iam_role_arn = 'arn:aws:iam::315128346896:role/LabRole'

    additional_data = {
        'message': message,
        'email': email
    }

    # Create an EventBridge client
    event_bridge_client = boto3.client('scheduler')

    response = event_bridge_client.create_schedule(
            # 'ActionAfterCompletion':'DELETE',
            Name=rule_name,
            FlexibleTimeWindow={
                'Mode': 'OFF'
            },
            ScheduleExpression=f"at({year_str}-{month_str}-{day_str}T{hour_str}:{minute_str}:00)",
            ScheduleExpressionTimezone='America/Halifax',
            State='ENABLED',
            Target = {
                'Arn': lambda_function_arn,
                'Input': json.dumps(additional_data),
                'RoleArn': existing_iam_role_arn
                
            })

    print(response)

    return {
        'statusCode': 200,
        'body': 'EventBridge rule created successfully.'
    }
