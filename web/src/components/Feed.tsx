import { gql, useMutation, useQuery } from '@apollo/client';
import { formatDistance, subDays } from 'date-fns';
import '../styles/feed.css';
import '../styles/primary.css';

export const FEED_QUERY = gql`
  query Feed {
    feed {
      title
      content
      image
      published
      viewCount
      author {
        name
        profile {
          avatar
        }
      }
      updatedAt
      createdAt
    }
  }
`;

const Feed = () => {
  const { loading, error, data } = useQuery(FEED_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);

  interface Post {
    title: string;
    content: string;
    image: string;
    createdAt: Date;
    author: {
      name: string;
      profile: {
        avatar: string;
      };
    };
  }

  return (
    <div>
      {data.feed.map((post: Post) => (
        <div className="feed-container">
          <div className="feed-header">
            <div className="feed-user-info">
              <img
                src={post.author.profile.avatar}
                style={{ width: '20px', borderRadius: '50%' }}
                alt="avatar"
              />
              <div>{post.author.name}</div>
            </div>
            <h3>{post.title}</h3>
            <img src={post.image} style={{ width: '500px' }} alt="post" />
            <div>{post.content}</div>
            <p className="date-time">
              {formatDistance(subDays(new Date(post.createdAt), 0), new Date())} ago
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
