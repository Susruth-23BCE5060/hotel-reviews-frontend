/*import { useState } from 'react';
import { Button, Card, Flex, Heading, Text, TextAreaField, TextField } from '@aws-amplify/ui-react';

export const ReviewForm = ({ user, signOut }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Submitting...');

    // NOTE: Replace this with your actual API Gateway Invoke URL
    const apiEndpoint = 'https://cbra8z5r6d.execute-api.us-east-1.amazonaws.com/dev/review';

    try {
      // Here you would typically get the idToken from the user's session
      // const token = user.signInUserSession.idToken.jwtToken;

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': token // Uncomment this when you configure API Gateway authorizer
        },
        body: JSON.stringify({
          hotelId: 'H1', // Using a hardcoded hotelId for now
          text: reviewText,
          rating: parseInt(rating, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessage(`Success! Review ID: ${data.reviewId}`);
      setReviewText('');
      setRating(5);
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('Failed to submit review. Check console for details.');
    }
  };

  return (
    <Card variation="outlined" width="100%" maxWidth="500px" margin="20px auto">
      <Flex direction="column">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading level={3}>Welcome, {user.username}</Heading>
          <Button onClick={signOut} size="small">Sign Out</Button>
        </Flex>
        
        <Heading level={2} marginTop="20px">Submit a Review</Heading>
        <form onSubmit={handleSubmit}>
          <TextAreaField
            label="Review"
            placeholder="Write your review here..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            isRequired
          />
          <TextField
            label="Rating (1-5)"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            step="1"
            isRequired
          />
          <Button type="submit" variation="primary" marginTop="20px">Submit Review</Button>
        </form>
        {message && <Text marginTop="15px">{message}</Text>}
      </Flex>
    </Card>
  );
};*/
import { useState } from 'react';
import { 
  Button, 
  Card, 
  Flex, 
  Heading, 
  Text, 
  TextAreaField, 
  TextField, 
  View 
} from '@aws-amplify/ui-react';

export const ReviewForm = ({ user, signOut }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // ===================================================================
      // !! IMPORTANT !!
      // REPLACE THIS URL with your API Gateway Invoke URL for POST /review
      const apiEndpoint = 'https://cbra8z5r6d.execute-api.us-east-1.amazonaws.com/dev/review';
      // ===================================================================

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelId: 'H1', // Hardcoded for this example
          text: reviewText,
          rating: parseInt(rating, 10),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review. Server returned ' + response.status);
      }

      setSuccess('Thank you! Your review has been submitted.');
      setReviewText('');
      setRating('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card variation="outlined" width="100%" maxWidth="800px">
      <View padding="20px">
        <Flex direction="row" justifyContent="space-between" alignItems="center">
          <Heading level={3}>Welcome, {user.username}</Heading>
          <Button onClick={signOut} variation="link">Sign Out</Button>
        </Flex>

        <Heading level={2} marginTop="20px">Submit a Review</Heading>
        <form onSubmit={handleSubmit}>
          <TextAreaField
            label="Your Review"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="The room was great, but the service was slow..."
            isRequired
          />
          <TextField
            label="Rating (1-5)"
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            isRequired
          />
          <Button type="submit" variation="primary" isLoading={submitting} marginTop="20px">
            Submit Review
          </Button>
        </form>
        {success && <Text color="green.80" marginTop="10px">{success}</Text>}
        {error && <Text color="red.80" marginTop="10px">{error}</Text>}
      </View>
    </Card>
  );
};