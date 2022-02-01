import { gql, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import CreateComment from '../components/CreateComment';
import CreateTag from '../components/CreateTag';
import LeftNav from '../components/LeftNav';
import '../styles/home.css';
import '../styles/primary.css';

export const POST_QUERY = gql`
  query PostById($id: Int) {
    postById(id: $id) {
      id
      title
      content
      image
      tags {
        name
      }
      author {
        id
        name
        profile {
          id
          avatar
        }
      }
      comments {
        id
        content
        createdAt
        user {
          id
          name
          profile {
            id
            avatar
          }
        }
      }
    }
  }
`;

interface CommentType {
  id: number;
  content: string;
  createdAt: Date;
  title: String;
  tags: [];
  user: {
    id: number;
    name: string;
    profile: {
      id: number;
      avatar: string;
    };
  };
}

interface Tag {
  id: number;
  name: string;
  post: {
    id: number;
  };
}

function Post() {
  const navigate = useNavigate();
  const { id } = useParams();

  console.log(id);

  const { loading, error, data } = useQuery(POST_QUERY, {
    variables: { id: parseInt(id!) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);

  return (
    <>
      <div className="primary">
        <div className="left"></div>
        <div className="home">
          <div className="home-header">
            <span className="back-arrow" onClick={() => navigate(-1)}>
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </span>
            <h3 className="home-title">{data.postById.title}</h3>
          </div>
          <img src={data.postById.image} style={{ width: '850px' }} alt="post" />
          <div className="feed-tags">
            {data.postById.tags.map((tag: Tag) => (
              <div className="rectangle">{tag.name}</div>
            ))}
            <CreateTag id={data.postById.id} />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 8fr',
              marginTop: '10px',
              marginLeft: '10px',
            }}
          >
            <img
              src={data.postById.author.profile.avatar}
              style={{ width: '40px', borderRadius: '50%' }}
              alt="avatar"
            />
            <h5>{data.postById.author.name}</h5>
          </div>
          <p
            style={{
              marginLeft: '20px',
              borderLeft: '1px solid var(--accent)',
              paddingLeft: '20px',
              height: '50px',
              marginTop: 0,
            }}
          >
            {data.postById.content}
          </p>
          {data.postById.comments.map((comment: CommentType) => (
            <div key={comment.id}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 8fr',
                  marginTop: '10px',
                  marginLeft: '10px',
                }}
              >
                <img
                  src={comment.user.profile.avatar}
                  style={{ width: '40px', borderRadius: '50%' }}
                  alt="avatar"
                />
                <h5>{comment.user.name}</h5>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
          <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <CreateComment
              avatar={data.postById.author.profile.avatar}
              name={data.postById.author.name}
              post={data.postById.content}
              id={data.postById.id}
            />
            {data.postById.comments.length > 0 ? data.postById.comments.length : null}
          </span>
        </div>
        <div className="right"></div>
      </div>
    </>
  );
}

export default Post;
