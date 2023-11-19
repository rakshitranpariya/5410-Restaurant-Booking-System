import json
import boto3



def getRestaurantName():
    # make API call
    return "Tawa grill"



restaurant_name = getRestaurantName()

def lambda_handler(event, context):
    print(event)

    try:
        for record in event['Records']:
            message = ""
            if record['eventName'] == 'INSERT':
                message = handle_insert(record)
            elif record['eventName'] == 'MODIFY':
                message = handle_modify(record)
            elif record['eventName'] == 'REMOVE':
                message = handle_remove(record)

            send_sns_notification(message)
        return "Successfully processed records."
    except Exception as e:
        print(e)
        return "Error"

def send_sns_notification(message):
    topic_arn = "arn:aws:sns:us-east-1:315128346896:restaurant_customers"
    # topic_arn = "arn:aws:sns:us-east-1:315128346896:menu-item-update"
    client = boto3.client("sns")
    subject = "There's a change in our menu !!"
    
    message_attributes = {
    'user_email': {
                'DataType': 'String',
                'StringValue': 'noon@forkshape.com'
        }
    # Add more attributes as needed
    }
    
    result = client.publish(TopicArn=topic_arn, Message=message, Subject=subject, MessageAttributes=message_attributes)
    if result['ResponseMetadata']['HTTPStatusCode'] == 200:
        print(result)
        print("Notification send successfully..!!!")
        return True
    else:
        print("Error occurred while publishing notifications and error is:", e)
        return False

def handle_insert(record):
    new_image = record['dynamodb']['NewImage']

    price = new_image['price']['N']
    availability = new_image['available']['BOOL']
    item_name = new_image['item_name']['S']

    if availability:
        message = f"{restaurant_name} has added {item_name} for ${price}"
    else:
        message = f"{restaurant_name} has {item_name} coming soon !!"

    return message

def handle_modify(record):
    new_image = record['dynamodb']['NewImage']
    old_image = record['dynamodb']['OldImage']

    old_price = old_image['price']['N']
    old_availability = old_image['available']['BOOL']
    old_name = old_image['item_name']['S']

    new_price = new_image['price']['N']
    new_availability = new_image['available']['BOOL']
    new_item_name = new_image['item_name']['S']

    # assuming either only price and availability can change

    if old_price != new_price:
        if new_availability:
            message = f"{restaurant_name} has changed the price of {new_item_name} from ${old_price} to ${new_price}"
        else:
            message = f"{restaurant_name} has changed the price of {new_item_name} from ${old_price} to ${new_price} and is not available anymore"
    else:
        if new_availability:
            message = f"{restaurant_name} has made {new_item_name} available"
        else:
            message = f"{restaurant_name} has made {new_item_name} unavailable"

    return message

def handle_remove(record):
    old_image = record['dynamodb']['OldImage']

    old_price = old_image['price']['N']
    old_availability = old_image['available']['BOOL']
    old_name = old_image['item_name']['S']

    if old_availability:
        message = f"{restaurant_name} has removed {old_name} from the menu"
    else:
        message = f"{restaurant_name} has removed {old_name} from the menu as it was out of stock"

    return message
