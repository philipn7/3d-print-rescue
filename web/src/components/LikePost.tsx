import { gql, useMutation } from '@apollo/client';
import { FEED_QUERY } from './Feed';

const LIKE_POST_MUTATION = gql`
  mutation likePost($id: Int) {
    likePost(id: $id) {
      id
    }
  }
`;

interface Props {
  postId: number;
}

const LikePost = ({ postId }: Props) => {
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    refetchQueries: [{ query: FEED_QUERY }],
  });

  const handleCreateLike = async () => {
    console.log(postId);

    try {
      await likePost({
        variables: { id: postId },
      });
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }
  };

  return (
    <span onClick={handleCreateLike} style={{ marginRight: '5px' }}>
      <i className="fas fa-medal" aria-hidden="true" />
    </span>
  );
};

export default LikePost;
