import json
import boto3
from datetime import datetime, timedelta


def lambda_handler(event, context):
    
    payload = event
    
    scheduled_date = payload["reservationDate"]
    scheduled_time = payload["reservationTime"]
    minutesToDeduct = payload["minutesToDeduct"]
    messageToRestaurant = payload["messageToRestaurant"]
    restaurantEmail = payload["restaurantEmail"]
    reservationId = payload["reservationId"]
    
    datetime_str = f"{scheduled_date} {scheduled_time}"
    original_datetime = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")

    result_datetime = original_datetime - timedelta(minutes=minutesToDeduct)

    result_str = result_datetime.strftime("%Y-%m-%d %H:%M")
    
    result_datetime = datetime.strptime(result_str, "%Y-%m-%d %H:%M")

    year = result_datetime.year
    month = result_datetime.month
    day = result_datetime.day
    hours = result_datetime.hour
    minutes = result_datetime.minute
    
    year_str = str(year)
    month_str = str(month).zfill(2)
    day_str = str(day).zfill(2)
    hour_str = str(hours).zfill(2)
    minute_str = str(minutes).zfill(2) 
    
    existing_iam_role_arn = 'arn:aws:iam::315128346896:role/LabRole'
    
    additional_data = {
        'message': messageToRestaurant,
        'email': restaurantEmail
    }
    
    # Create an EventBridge client
    event_bridge_client = boto3.client('scheduler')

    lambda_function_arn = "arn:aws:lambda:us-east-1:315128346896:function:send_notif_to_restaurants"
    response = event_bridge_client.create_schedule(
            # 'ActionAfterCompletion':'DELETE',
            Name=reservationId,
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
        'body': json.dumps('Hello from Lambda!')
    }
