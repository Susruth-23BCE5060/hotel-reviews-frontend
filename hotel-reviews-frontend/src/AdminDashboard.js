/*import { useEffect, useState } from 'react';
import { Card, Heading, Loader, Text } from '@aws-amplify/ui-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const AdminDashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      // NOTE: Replace this with your actual API Gateway Invoke URL for analytics
      // Use a hardcoded hotel ID for now, e.g., H1
      const analyticsEndpoint = 'https://cbra8z5r6d.execute-api.us-east-1.amazonaws.com/dev/analytics/H1';
      
      try {
        const response = await fetch(analyticsEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        
        // Format the data for Chart.js
        const labels = Object.keys(data);
        const chartJsData = {
          labels,
          datasets: [
            {
              label: 'Avg. Positive Sentiment',
              data: labels.map(label => data[label].avg_positive),
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
              label: 'Avg. Negative Sentiment',
              data: labels.map(label => data[label].avg_negative),
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
          ],
        };
        setChartData(chartJsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []); // The empty array ensures this runs only once when the component mounts

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Average Sentiment by Aspect' },
    },
    scales: {
      y: { beginAtZero: true, max: 1 },
    },
  };

  return (
    <Card variation="outlined" width="100%" maxWidth="800px" margin="20px auto">
      <Heading level={2}>Admin Dashboard</Heading>
      {loading && <Loader />}
      {error && <Text color="red">{error}</Text>}
      {chartData && !loading && !error && (
        <Bar options={options} data={chartData} />
      )}
    </Card>
  );
};*/


/*import { useEffect, useState } from 'react';
// --- THIS IS THE CORRECT IMPORT ---
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
// ----------------------------------
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
        // MAKE SURE THIS URL IS CORRECT
        const analyticsEndpoint = 'https://cbra8z5r6d.execute-api.us-east-1.amazonaws.com/dev/analytics/H1';
        // ===================================================================

        const response = await fetch(analyticsEndpoint);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics. Check API URL and CORS settings.');
        }
        const data = await response.json();
        
        // Transform the data for the recharts library
        const formattedData = Object.keys(data).map(aspect => ({
          name: aspect, // e.g., "service", "room"
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
        // --- THIS IS THE NEW RECHARTS COMPONENT ---
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
        // -----------------------------------------
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
};