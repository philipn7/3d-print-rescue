import { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';

const USERS_QUERY = gql`
  query USERS_QUERY {
    allUsers {
      id
      name
    }
  }
`;

interface User {
  name: string;
  id: number;
}

const Users = () => {
  const { loading, error, data } = useQuery(USERS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return (
    <Fragment>
      {data.allUsers.map((user: User) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </Fragment>
  );
};

export default Users;
