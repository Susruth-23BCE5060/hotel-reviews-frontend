import { useEffect, useState } from 'react';
import { Card, Flex, Heading, Loader, Text, Collection } from '@aws-amplify/ui-react';

export const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // ===================================================================
        // !! IMPORTANT !!
        // MAKE SURE THIS URL IS YOUR CORRECT API GATEWAY URL
        // ===================================================================
        const apiEndpoint = 'https://cbra8z5r6d.execute-api.us-east-1.amazonaws.com/dev/reviews/H1';
        
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews. Check API URL and CORS settings.');
        }
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <Loader margin="20px auto" />;
  // If you still have the 500 error, you must fix your 'get_reviews' Lambda.
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Card variation="outlined" width="100%" maxWidth="800px" margin="20px auto">
      <Heading level={2} marginBottom="20px">Recent Reviews</Heading>
      {reviews.length === 0 ? (
        <Text>No reviews have been submitted yet.</Text>
      ) : (
        <Collection
          items={reviews}
          type="list"
          direction="column"
          gap="20px"
          // --- THESE ARE THE NEW PROPERTIES ---
          height="500px"  // Sets a fixed height (approx. 5 reviews)
          overflow="auto" // Adds a scrollbar *only to this box*
          // ----------------------------------
        >
          {(item, index) => (
            <Card key={index} variation="outlined">
              <Flex direction="column">
                <Heading level={5}>Rating: {item.rating} / 5</Heading>
                <Text>{item.text}</Text>
              </Flex>
            </Card>
          )}
        </Collection>
      )}
    </Card>
  );
};