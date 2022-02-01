import { useMutation, useQuery } from '@apollo/client';
import { id } from 'date-fns/locale';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import gql from 'graphql-tag';
import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import { ME_QUERY } from '../pages/Profile';
import { customStyles } from '../styles/CustomModalStyles';

const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($id: Int, $content: String) {
    createComment(id: $id, content: $content) {
      id
    }
  }
`;

interface CommentValues {
  content: string;
}

interface Props {
  post: string;
  name: string;
  avatar: string;
  id: number;
}

const CreateComment: React.FC<Props> = ({ post, name, avatar, id }: Props) => {
  const { loading, error, data } = useQuery(ME_QUERY);
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);

  const initialValues: CommentValues = {
    content: '',
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <span onClick={openModal}>
        <i className="far fa-comments" aria-hidden="true" />
      </span>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <span className="exit" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true" />
        </span>
        <div className="header" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 8fr', marginTop: '10px' }}>
          <img src={avatar} style={{ width: '40px', borderRadius: '50%' }} alt="avatar" />
          <h5>{name}</h5>
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
          {post}
        </p>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await createComment({
              variables: { ...values, id },
            });

            setSubmitting(false);
            setIsOpen(false);
          }}
        >
          <Form>
            <span
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 8fr',
                marginTop: '10px',
                marginLeft: '10px',
              }}
            >
              <img
                src={data.me.profile?.avatar}
                style={{ width: '40px', borderRadius: '50%' }}
                alt="avatar"
              />
              <h3>{data.me.name}</h3>
            </span>
            <Field name="content" type="text" as="textarea" placeholder="Your reply..." />
            <ErrorMessage name="content" component={'div'} />

            <div className="footer" />
            <button type="submit">
              <span>Reply</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default CreateComment;
