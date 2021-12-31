import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router';
import CreateProfile from '../components/CreateProfile';
import LeftNav from '../components/LeftNav';
import UpdateProfile from '../components/UpdateProflie';
import '../styles/primary.css';
import '../styles/profile.css';

export const ME_QUERY = gql`
  query me {
    me {
      id
      name
      profile {
        id
        bio
        location
        avatar
      }
    }
  }
`;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(ME_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);

  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div className="profile">
          <div className="profile-info">
            <div className="profile-head">
              <span className="back-arrow" onClick={() => navigate(-1)}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
              <span className="nickname">
                <h3>{data.me.name}</h3>
              </span>
            </div>
            <div className="avatar">
              {data.me.profile?.avatar ? (
                <img
                  src={data.me.profile.avatar}
                  style={{ width: '150px', borderRadius: '50%' }}
                  alt="avatar"
                />
              ) : (
                <i className="fa fa-user fa-5x" aria-hidden="true"></i>
              )}
            </div>
            <div className="make-profile">
              {data.me.profile ? <UpdateProfile /> : <CreateProfile />}
            </div>

            {data.me.profile ? (
              <div>
                <p>{data.me.profile.bio}</p>
                <p>{data.me.profile.location}</p>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="right">Right Nav</div>
      </div>
    </>
  );
};

export default Profile;
