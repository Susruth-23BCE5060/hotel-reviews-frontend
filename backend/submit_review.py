import json
import os
import uuid
from datetime import datetime
import boto3
from decimal import Decimal

# Try importing huggingface_hub from the layer
try:
    from huggingface_hub import InferenceClient
    hf_client = InferenceClient(token=os.getenv("HF_TOKEN"))
except Exception as e:
    print(f"Failed to load Hugging Face client: {e}")
    hf_client = None

# Initialize AWS services
db = boto3.resource('dynamodb')
table = db.Table('HotelReviews')

ASPECT_KEYWORDS = {
    'room': ['room', 'bed', 'space', 'suite', 'ac', 'air conditioning'],
    'cleanliness': ['clean', 'dirty', 'hygiene', 'housekeeping', 'towels', 'linen'],
    'food': ['food', 'breakfast', 'dinner', 'restaurant', 'meal', 'menu'],
    'service': ['service', 'staff', 'reception', 'check-in', 'waiter', 'attendant'],
    'price': ['price', 'cost', 'expensive', 'cheap', 'value']
}

def map_aspects(text):
    text_low = text.lower()
    found = {}
    for aspect, kws in ASPECT_KEYWORDS.items():
        for kw in kws:
            if kw in text_low:
                found.setdefault(aspect, []).append(kw)
    return list(found.keys())

def detect_sentiment(text):
    if not hf_client:
        raise Exception("Hugging Face client is not available. Check layer or HF_TOKEN.")
        
    result = hf_client.text_classification(text)
    best_sentiment = max(result, key=lambda x: x['score'])
    label = best_sentiment['label']
    score = best_sentiment['score']
    
    overall_sentiment = label.upper()
    overall_scores = {'Positive': Decimal(0), 'Negative': Decimal(0), 'Neutral': Decimal(0)}
    
    if overall_sentiment == 'POSITIVE':
        overall_scores['Positive'] = Decimal(str(score))
    elif overall_sentiment == 'NEGATIVE':
        overall_scores['Negative'] = Decimal(str(score))
        
    return overall_sentiment, overall_scores

def lambda_handler(event, context):
    try:
        body = event.get('body')
        if isinstance(body, str):
            body = json.loads(body)
            
        hotelId = body.get('hotelId')
        text = body.get('text', '')
        rating = body.get('rating')
        userId = "user-" + str(uuid.uuid4())
        reviewId = str(uuid.uuid4())
        createdAt = datetime.utcnow().isoformat()
        
        aspects = map_aspects(text)
        overall_sentiment, overall_scores = detect_sentiment(text)
        
        aspectSentiment = {}
        for aspect in aspects:
            aspectSentiment[aspect] = overall_scores
            
        item = {
            'PK': f"REVIEW#{reviewId}",
            'SK': f"METADATA#{createdAt}",
            'GSI1PK': f"HOTEL#{hotelId}",
            'GSI1SK': createdAt,
            'hotelId': hotelId,
            'userId': userId,
            'text': text,
            'rating': int(rating),
            'createdAt': createdAt,
            'aspectSentiment': aspectSentiment,
            'overallSentiment': overall_sentiment
        }
        
        table.put_item(Item=item)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'message': 'Review stored successfully (with Hugging Face sentiment)',
                'reviewId': reviewId
            })
        }
    except Exception as e:
        print(f"An error occurred: {e}")
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}