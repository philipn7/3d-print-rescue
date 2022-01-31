import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router';
import Feed from '../components/Feed';
import LeftNav from '../components/LeftNav';
import '../styles/primary.css';
import '../styles/home.css';
import LikePost from '../components/LikePost';

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

const Home: React.FC = () => {
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
        <div className="home">
          <div className="home-header">
            <h3 className="home-title">3D Print Rescue</h3>
          </div>
          <Feed />
        </div>
        <div className="right"></div>
      </div>
    </>
  );
};

export default Home;
