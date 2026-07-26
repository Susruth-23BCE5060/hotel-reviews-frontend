import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
const sesClient = new SESv2Client({});

// Environment Variables
const REVIEW_TABLE_NAME = process.env.REVIEW_TABLE_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const SENDER_EMAIL = process.env.SENDER_EMAIL;

function analyzeReviews(reviews) {
    const aspectCounts = new Map();
    for (const review of reviews) {
        if (!review.sentiments || typeof review.sentiments !== 'object') {
            continue;
        }
        for (const [aspect, sentiment] of Object.entries(review.sentiments)) {
            if (!aspectCounts.has(aspect)) {
                aspectCounts.set(aspect, { positive: 0, neutral: 0, negative: 0, total: 0});
            }
            const counts = aspectCounts.get(aspect);
            if (sentiment === 'positive') counts.positive += 1;
            else if (sentiment === 'neutral') counts.neutral += 1;
            else if (sentiment === 'negative') counts.negative += 1;
            counts.total += 1;
        }
    }
    
    const aspectsToReview = [];
    for (const [aspect, counts] of aspectCounts.entries()) {
        if (counts.total === 0) continue;
        const problematicCount = counts.neutral + counts.negative;
        const problematicPercentage = (problematicCount / counts.total);
        if (problematicPercentage > 0.5) {
            aspectsToReview.push(aspect);
        }
    }
    return aspectsToReview;
}

export const handler = async (event) => {
    console.log('Daily review alert function triggered.');
    
    if (!REVIEW_TABLE_NAME || !ADMIN_EMAIL || !SENDER_EMAIL) {
        console.error('Missing environment variables!');
        return;
    }
    
    // 1. Get timestamp for 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    // 2. Scan DynamoDB for new reviews
    const scanCommand = new ScanCommand({
        TableName: REVIEW_TABLE_NAME,
        FilterExpression: 'createdAt > :date',
        ExpressionAttributeValues: { ':date': twentyFourHoursAgo },
        ProjectionExpression: 'sentiments',
    });
    
    let allNewReviews = [];
    try {
        const result = await ddbDocClient.send(scanCommand);
        allNewReviews = result.Items || [];
        console.log(`Found ${allNewReviews.length} new reviews.`);
    } catch (error) {
        console.error('Error scanning DynamoDB:', error);
        return;
    }
    
    const newReviewCount = allNewReviews.length;
    
    // 3. Analyze the reviews
    const aspectsToReview = analyzeReviews(allNewReviews);
    
    // 4. Build the email message
    let aspectMessage = 'no aspects need actions';
    if (aspectsToReview.length > 0) {
        aspectMessage = `aspects ${aspectsToReview.join(', ')} need actions`;
    }
    
    const finalMessage = `Today there are ${newReviewCount} new reviews and ${aspectMessage}.`;
    const emailSubject = `Daily Review Report: ${newReviewCount} New Reviews`;
    
    // 5. Send the email using SES
    const emailBodyHtml = `
        <html>
        <head><style>body { font-family: Arial, sans-serif; font-size: 16px; }</style></head>
        <body>
            <p>Hello Admin,</p>
            <p style="font-size: 18px; font-weight: bold;">${finalMessage}</p>
        </body>
        </html>
    `;
    
    const sendEmailCommand = new SendEmailCommand({
        FromEmailAddress: SENDER_EMAIL,
        Destination: { ToAddresses: [ADMIN_EMAIL] },
        Content: {
            Simple: {
                Subject: { Data: emailSubject, Charset: 'UTF-8' },
                Body: {
                    Html: { Data: emailBodyHtml, Charset: 'UTF-8' },
                    Text: { Data: `Hello Admin, ${finalMessage}`, Charset: 'UTF-8' },
                },
            },
        },
    });
    
    try {
        await sesClient.send(sendEmailCommand);
        console.log('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email via SES:', error);
    }
};