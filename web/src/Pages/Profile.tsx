import { gql, useQuery } from '@apollo/client';
import CreateProfile from '../components/CreateProfile';
import UpdateProfile from '../components/UpdateProflie';

export const ME_QUERY = gql`
  query me {
    me {
      id
      profile {
        id
        bio
        location
        avatar
      }
    }
  }
`;

function Profile() {
  const { loading, error, data } = useQuery(ME_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);

  return (
    <div className="container">
      <h3>Profile</h3>
      {data.me.profile.id ? <UpdateProfile /> : <CreateProfile />}
      <p>{data.me.profile.bio}</p>
      <p>{data.me.profile.location}</p>
      <p>{data.me.profile.avatar}</p>
    </div>
  );
}

export default Profile;
