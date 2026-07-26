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
            KeyConditionExpression=Key('GSI1PK').eq(f"HOTEL#{hotel_id}")
        )
        items = response.get('Items', [])
        
        aspect_sentiments = {}
        for item in items:
            for aspect, scores in item.get('aspectSentiment', {}).items():
                if aspect not in aspect_sentiments:
                    aspect_sentiments[aspect] = {'positive': [], 'negative': [], 'neutral': []}
                aspect_sentiments[aspect]['positive'].append(scores.get('Positive', 0))
                aspect_sentiments[aspect]['negative'].append(scores.get('Negative', 0))
                aspect_sentiments[aspect]['neutral'].append(scores.get('Neutral', 0))
                
        aspect_analytics = {}
        for aspect, scores in aspect_sentiments.items():
            count = len(scores['positive'])
            if count > 0:
                aspect_analytics[aspect] = {
                    'avg_positive': sum(scores['positive']) / count,
                    'avg_negative': sum(scores['negative']) / count,
                    'avg_neutral': sum(scores['neutral']) / count
                }
            else:
                aspect_analytics[aspect] = {'avg_positive': 0, 'avg_negative': 0, 'avg_neutral': 0}
                
        suggestions = []
        if not items:
            suggestions.append("No review data yet. Submit some reviews to see suggestions.")
        else:
            for aspect, data in aspect_analytics.items():
                if data['avg_negative'] > 0.4: # If avg negative sentiment is over 40%
                    suggestions.append(f"{aspect.capitalize()} ratings are very low. This area needs immediate attention.")
                elif data['avg_positive'] < 0.5: # If avg positive sentiment is under 50%
                    suggestions.append(f"{aspect.capitalize()} ratings are mediocre. Look for ways to improve this experience.")
                    
        if not suggestions and items:
            suggestions.append("All sentiment scores are looking good! Keep up the great work.")
            
        final_response = {
            "chartData": aspect_analytics,
            "suggestions": suggestions
        }
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps(final_response, cls=DecimalEncoder)
        }
    except Exception as e:
        print(f"Error: {e}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }