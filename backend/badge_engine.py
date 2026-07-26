import json
import boto3
from collections import defaultdict

db = boto3.resource('dynamodb')
table = db.Table('HotelReviews')

def handler(event, context):
    print("Starting badge engine...")
    user_review_counts = defaultdict(int)
    paginator = db.meta.client.get_paginator('scan')
    pages = paginator.paginate(TableName='HotelReviews')
    
    for page in pages:
        for item in page['Items']:
            if item.get('PK', '').startswith('REVIEW#') and 'userId' in item:
                user_id = item['userId']
                if user_id != 'anonymous':
                    user_review_counts[user_id] += 1
                    
    print(f"Found reviews for {len(user_review_counts)} users.")
    
    for user_id, count in user_review_counts.items():
        badges = []
        if count >= 1:
            badges.append('First Review')
        if count >= 5:
            badges.append('Enthusiast')
        if count >= 10:
            badges.append('Top Contributor')
            
        if badges:
            print(f"Awarding badges {badges} to user {user_id}")
            
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Badge engine run completed successfully.',
            'processed_users': len(user_review_counts)
        })
    }