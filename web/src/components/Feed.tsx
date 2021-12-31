import { gql, useMutation, useQuery } from '@apollo/client';
import { formatDistance, subDays } from 'date-fns';
import { ME_QUERY } from '../pages/Profile';
import '../styles/feed.css';
import '../styles/primary.css';
import LikePost from './LikePost';

export const FEED_QUERY = gql`
  query Feed {
    feed {
      id
      title
      content
      image
      published
      viewCount
      liked {
        id
      }
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
  const { loading: meLoading, error: meError, data: meData } = useQuery(ME_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);
  if (meLoading) return <p>Loading...</p>;
  if (meError) console.log(meError.message);

  interface Post {
    id: number;
    title: string;
    content: string;
    image: string;
    createdAt: Date;
    liked: [];
    author: {
      name: string;
      profile: {
        avatar: string;
      };
    };
  }

  interface LikedPost {
    id: number;
    post: {
      id: number;
    };
  }

  return (
    <div>
      {data.feed
        .slice(0)
        .reverse()
        .map((post: Post) => (
          <div className="feed-container" key={post.id}>
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
              <div className="likes">
                {meData.me.liked.map((t: LikedPost) => t.post.id).includes(post.id) ? (
                  <span>
                    <i className="fas fa-thumbs-up" aria-hidden="true" />
                    {post.liked.length}
                  </span>
                ) : (
                  <span>
                    <LikePost postId={post.id} />
                    {post.liked.length}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Feed;
