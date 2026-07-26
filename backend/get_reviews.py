import json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

db = boto3.resource('dynamodb')
table = db.Table('HotelReviews')

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
    try:
        path = event.get('rawPath', '')
        hotel_id = path.split('/')[-1]
        
        if not hotel_id:
            raise ValueError("hotelId is empty after parsing path.")
            
        response = table.query(
            IndexName='GSI1',
            KeyConditionExpression=Key('GSI1PK').eq(f"HOTEL#{hotel_id}"),
            ScanIndexForward=False
        )
        
        reviews = []
        for item in response.get('Items', []):
            reviews.append({
                'reviewId': item['PK'].split('#')[-1],
                'text': item.get('text'),
                'rating': item.get('rating'),
                'badges': item.get('badges', []) # NEW: Get the badges
            })
            
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(reviews, cls=DecimalEncoder)
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }