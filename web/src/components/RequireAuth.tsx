import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Navigate, useLocation } from 'react-router-dom';

const IS_LOGGED_IN = gql`
  {
    me {
      id
    }
  }
`;

interface Props {
  children?: React.ReactNode;
}

const RequireAuth = ({ children }: Props) => {
  const location = useLocation();
  const { loading, error, data } = useQuery(IS_LOGGED_IN);
  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);
  if (error || !data.me) {
    return <Navigate to="/login" state={{ path: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
