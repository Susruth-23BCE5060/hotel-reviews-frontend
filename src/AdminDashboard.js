/*

import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, Heading, Loader, Text } from '@aws-amplify/ui-react';

export const AdminDashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // ===================================================================
        // !! IMPORTANT !!
        // PASTE YOUR INVOKE URL HERE (e.g., 'https://.../dev/analytics/H1')
        // ===================================================================
        const analyticsEndpoint = 'https://cbra8z5r6d.execute-api.us-east-1.amazonaws.com/dev/analytics/H1';

        const response = await fetch(analyticsEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics. Check API URL and CORS settings.');
        }
        const data = await response.json();
        
        const formattedData = Object.keys(data).map(aspect => ({
          name: aspect,
          Positive: data[aspect].avg_positive * 100,
          Negative: data[aspect].avg_negative * 100,
          Neutral: data[aspect].avg_neutral * 100,
        }));
        setChartData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader margin="20px auto" />;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Card variation="outlined" width="100%" maxWidth="800px" padding="20px">
      <Heading level={2}>Admin Dashboard: Sentiment Analytics</Heading>
      {chartData.length === 0 ? (
        <Text>No analytics data to display. Submit a review first.</Text>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Sentiment (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Positive" fill="#4CAF50" />
            <Bar dataKey="Negative" fill="#F44336" />
            <Bar dataKey="Neutral" fill="#FFC107" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};*/
import { useEffect, useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, Heading, Loader, Text, Flex, Collection } from '@aws-amplify/ui-react';

export const AdminDashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // <-- NEW STATE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // MAKE SURE THIS URL IS YOUR CORRECT API GATEWAY URL
        const analyticsEndpoint = 'https://cbra8z5r6d.execute-api.us-east-1.amazonaws.com/dev/analytics/H1';

        const response = await fetch(analyticsEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics. Check API URL and CORS settings.');
        }
        const data = await response.json();
        
        // Transform data for the chart
        const formattedData = Object.keys(data.chartData).map(aspect => ({
          name: aspect,
          Positive: data.chartData[aspect].avg_positive * 100,
          Negative: data.chartData[aspect].avg_negative * 100,
          Neutral: data.chartData[aspect].avg_neutral * 100, // <-- Completed this line
        }));

        setChartData(formattedData);
        setSuggestions(data.suggestions); // <-- SET SUGGESTIONS STATE
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader margin="20px auto" />;
  if (error) return <Text color="red">{error}</Text>;

  return (
    // Use a Flex container to hold both cards
    <Flex direction="column" alignItems="center" width="100%" maxWidth="800px">
      <Card variation="outlined" width="100%" padding="20px">
        <Heading level={2}>Admin Dashboard: Sentiment Analytics</Heading>
        {chartData.length === 0 ? (
          <Text>No analytics data to display. Submit a review first.</Text>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Sentiment (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Positive" fill="#4CAF50" />
              <Bar dataKey="Negative" fill="#F44336" />
              <Bar dataKey="Neutral" fill="#FFC107" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* --- NEW: SUGGESTIONS CARD --- */}
      <Card variation="outlined" width="100%" padding="20px" marginTop="20px">
        <Heading level={3}>Actionable Suggestions</Heading>
        <Collection
          items={suggestions}
          type="list"
          direction="column"
          gap="10px"
          marginTop="15px"
        >
          {(item, index) => (
            <Text key={index}>{item}</Text>
          )}
        </Collection>
      </Card>
      {/* --------------------------- */}
    </Flex>
  );
};