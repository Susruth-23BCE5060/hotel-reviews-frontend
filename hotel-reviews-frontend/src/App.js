/*import { useEffect, useState } from 'react';
import { Authenticator, View, Flex, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ReviewForm } from './ReviewForm';
import { AdminDashboard } from './AdminDashboard';
import { fetchAuthSession } from 'aws-amplify/auth'; // A more direct way to get session info

// We create a new component to hold the main application content.
const AppContent = ({ user, signOut }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserGroup = async () => {
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.accessToken.payload["cognito:groups"] || [];
        
        // --- For Debugging ---
        console.log("User's Cognito groups found:", groups);
        // ---------------------

        if (groups.includes('admins')) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching user session or groups:", error);
      } finally {
        setIsLoading(false); // Stop loading once checked
      }
    };

    if (user) {
      checkUserGroup();
    }
  }, [user]);

  // While we're checking, show a loading message
  if (isLoading) {
    return <Heading level={3}>Loading...</Heading>;
  }

  return (
    <View padding="20px">
      <Flex direction="column" alignItems="center">
        <ReviewForm user={user} signOut={signOut} />
        <hr style={{ width: '80%', margin: '40px 0' }} />
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <Heading level={3} marginTop="20px">You are not authorized to view the admin dashboard.</Heading>
        )}
      </Flex>
    </View>
  );
};

// The main App component remains the same
function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <AppContent user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}

export default App;*/
import { useEffect, useState } from 'react';
import { Authenticator, View, Flex, Loader } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { ReviewForm } from './ReviewForm';
import { AdminDashboard } from './AdminDashboard';
import { ReviewList } from './ReviewList';
import { fetchAuthSession } from 'aws-amplify/auth';

const AppContent = ({ user, signOut }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserGroup = async () => {
      try {
        const session = await fetchAuthSession();
        const groups = session.tokens?.idToken.payload["cognito:groups"] || [];
        if (groups.includes('admins')) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching user session or groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkUserGroup();
    }
  }, [user]);

  if (isLoading) {
    return <Loader size="large" margin="20px auto" />;
  }

  return (
    <View padding="20px">
      <Flex direction="column" alignItems="center">
        {/* The ReviewForm is shown to ALL signed-in users */}
        <ReviewForm user={user} signOut={signOut} />
        
        <hr style={{ width: '80%', margin: '40px 0' }} />

        {/* --- THIS IS THE UPDATED LOGIC --- */}
        {isAdmin ? (
          <>
            <AdminDashboard />
            <ReviewList /> 
          </>
        ) : (
          <ReviewList /> 
        )}
        {/* ---------------------------------- */}
      </Flex>
    </View>
  );
};

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <AppContent user={user} signOut={signOut} />
      )}
    </Authenticator>
  );
}

export default App;