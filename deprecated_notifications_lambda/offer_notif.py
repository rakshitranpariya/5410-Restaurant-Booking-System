import boto3

region = process.env.AWS_REGION
queue_url = process.env.SQS_QUEUE_URL

sqs = boto3.client('sqs', region_name=region)

# Send a message to the SQS queue
response = sqs.send_message(
    QueueUrl=queue_url,
    MessageBody='Offer_notif',
)

print(f"Message sent. MessageId: {response['MessageId']}")
