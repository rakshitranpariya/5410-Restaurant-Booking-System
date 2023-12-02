import json
import requests
import boto3
from datetime import datetime

def lambda_handler(event, context):
    api_url = 'https://vzgth5nw0m.execute-api.us-east-1.amazonaws.com/prod/5410-project-getretaurantListOnCurrentTime'
    current_time = datetime.now().strftime("%H:%M:%S")

    print(current_time)
    payload = {
        "time": "21:00:00" 
            #current_time --> change it back to current_time in prod
    }
    
    try:
        # Make a POST request to the API
        response = requests.post(api_url, json=payload)
        response_data = response.json()
        
        print("got response from get-restaurants api")
        if len(response_data) == 0:
            return
        
        sqs = boto3.client("sqs")
        
        if response.status_code == 200:
            
            list_of_restaurants_json_string = json.dumps(response_data)

            sqs_response = sqs.send_message(
                QueueUrl = "https://sqs.us-east-1.amazonaws.com/315128346896/open_restaurants_list_queue",
                MessageBody = list_of_restaurants_json_string)
            return {
                'statusCode': sqs_response["ResponseMetadata"]["HTTPStatusCode"],
                'body': json.dumps(sqs_response["ResponseMetadata"])
            }

    except Exception as e:
        # Handle any exceptions
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }
    
    return {
        'statusCode': 200,
        'body': "Something went wrong"
    }    
    