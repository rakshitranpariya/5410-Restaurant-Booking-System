import json
import boto3

def lambda_handler(event, context):
# {
#   "reservationId": "1234567890",
#   "restaurantEmail": "u.boonking@gmail.com",
#   "reservationDate": "2023-11-20",
#   "reservationTime": "16:00",
#   "customerName": "Boon",
#   "numberOfGuests": 4,
#   "customerName": "Boon",
#   "eventType": "INSERT | MODIFY | DELETE",
#   "menu": [
#     {
#       "menu_item": "chicken"     
#     },
#     {
#       "menu_item": "Tandoori naan"
#     }
# ]
# }
   
    reservationId = event["reservationId"]
    restaurant_email = event['restaurantEmail'] 
    reservation_date = event['reservationDate']
    reservation_time = event['reservationTime']
    number_of_guests = event['numberOfGuests']
    customer_name = event['customerName']
    event_type = event['eventType']
    menu = event['menu']

   
    subject = ''
    body = ''
    menu_items = ''
    has_menu = False
    minutes_to_deduct = 10
    
    print("sdfsd:")
    print(len(menu))
    if menu:
        if len(menu) > 0:
            has_menu = True
            minutes_to_deduct = 60
            for item in menu:
                menu_items += f"{item['menu_item']}\n"
    
    if event_type == 'INSERT':
        subject = 'New reservation'
        body = f'You have a new reservation for {customer_name} for {number_of_guests} guests on {reservation_date} at {reservation_time}.\n{menu_items}'
    elif event_type == 'MODIFY':
        subject = 'Updated reservation'
        body = f'{customer_name} updated their reservation to {number_of_guests} guests on {reservation_date} at {reservation_time}.\n{menu_items}'
    elif event_type == 'DELETE':
        subject = 'Cancelled reservation'
        body = f'{customer_name} cancelled reservation for {number_of_guests} guests on {reservation_date} at {reservation_time}.\n{menu_items}'
    
    message_attributes = {
    'user_email': {
                'DataType': 'String',
                'StringValue': restaurant_email
        }
    }
    
    sns = boto3.client('sns')
    result = sns.publish(
        TopicArn='arn:aws:sns:us-east-1:315128346896:restaurant_owners',
        Subject=subject,
        Message=body, 
        MessageAttributes=message_attributes
    )
    
    if result['ResponseMetadata']['HTTPStatusCode'] == 200:
        print(result)
        print("Notification send successfully..!!!")
    else:
        print("Error occurred while publishing notifications and error is:", e)
    
    return {
        'statusCode': 200,
        "minutesToDeduct": minutes_to_deduct,
        "messageToRestaurant": body,
        "reservationDate": reservation_date,
        "reservationTime": reservation_time,
        "restaurantEmail": restaurant_email,
        "reservationId": reservationId,
        "eventType": event_type
    }
