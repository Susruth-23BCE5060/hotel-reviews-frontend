/*import { useEffect, useState } from 'react';
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
};*/
import { useEffect, useState } from 'react';
import { 
    Card, 
    Flex, 
    Heading, 
    Loader, 
    Text, 
    Collection, 
    Badge,
    // --- THIS IS THE FIX ---
    ToggleButton,
    ToggleButtonGroup
    // -----------------------
} from '@aws-amplify/ui-react';

export const ReviewList = () => {
  const [allReviews, setAllReviews] = useState([]); // Stores all reviews from API
  const [displayedReviews, setDisplayedReviews] = useState([]); // Stores filtered reviews
  const [filterMode, setFilterMode] = useState('recent'); // 'recent', 'top', or 'critical'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch data only once when the component loads
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // MAKE SURE THIS URL IS YOUR CORRECT API GATEWAY URL
        const apiEndpoint = 'https://cbra8z5r6d.execute-api.us-east-1.amazonaws.com/dev/reviews/H1';
        
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch reviews. Check API URL and CORS settings.');
        }
        const data = await response.json();
        setAllReviews(data); // Store the master list
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // 2. This effect runs whenever the filter or the master list changes
  useEffect(() => {
    let filtered = [...allReviews]; // Start with all reviews

    if (filterMode === 'top') {
      // Filter for 4 and 5 stars
      filtered = allReviews.filter(review => review.rating >= 4);
    } else if (filterMode === 'critical') {
      // Filter for 2 stars and lower
      filtered = allReviews.filter(review => review.rating <= 2);
    }
    // 'recent' mode just uses the default list, which is already sorted by the backend.

    setDisplayedReviews(filtered);
  }, [filterMode, allReviews]); // Re-run this logic when filterMode or allReviews changes

  if (error) return <Text color="red">{error}</Text>;

  return (
    <Card variation="outlined" width="100%" maxWidth="800px" margin="20px auto">
      <Heading level={2} marginBottom="20px">Recent Reviews</Heading>

      {/* --- NEW: FILTER BUTTONS (Using ToggleButtonGroup) --- */}
      <ToggleButtonGroup
        value={filterMode}
        onChange={(value) => setFilterMode(value)}
        isExclusive // This makes it act like radio buttons (only one can be selected)
        marginBottom="20px"
      >
        <ToggleButton value="recent">Recent</ToggleButton>
        <ToggleButton value="top">Top Reviews</ToggleButton>
        <ToggleButton value="critical">Critical Reviews</ToggleButton>
      </ToggleButtonGroup>
      {/* ---------------------------------------------------- */}
      
      {loading ? (
        <Loader margin="20px auto" />
      ) : displayedReviews.length === 0 ? (
        // Show a message if no reviews match the filter
        <Text>No reviews found for this filter.</Text>
      ) : (
        <Collection
          items={displayedReviews} // <-- Use the filtered list
          type="list"
          direction="column"
          gap="20px"
          height="500px" 
          overflow="auto"
        >
          {(item, index) => (
            <Card key={index} variation="outlined">
              <Flex direction="column">
                <Heading level={5}>Rating: {item.rating} / 5</Heading>
                <Text>{item.text}</Text>
                
                {item.badges && item.badges.length > 0 && (
                  <Flex direction="row" gap="10px" marginTop="10px">
                    {item.badges.map((badge, badgeIndex) => (
                      <Badge 
                        key={badgeIndex} 
                        variation={badge === "Top Reviewer" ? "success" : "info"}
                      >
                        {badge}
                      </Badge>
                    ))}
                  </Flex>
                )}
              </Flex>
            </Card>
          )}
        </Collection>
      )}
    </Card>
  );
};