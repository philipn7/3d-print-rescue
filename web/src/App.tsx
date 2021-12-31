import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import Users from './components/Users';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import { setContext } from '@apollo/client/link/context';
import Signup from './pages/Signup';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';
import Profile from './pages/Profile';

// Local storage cookies are NOT secure. Change this later...
const httpLink = createHttpLink({ uri: 'http://localhost:4000' });
const authLink = setContext(async (req, { headers }) => {
  const token = localStorage.getItem('token');

  return {
    ...headers,
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const link = authLink.concat(httpLink as any);
const client = new ApolloClient({
  link: link as any,
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route
            path="/users"
            element={
              <RequireAuth>
                <Users />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/landing" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
