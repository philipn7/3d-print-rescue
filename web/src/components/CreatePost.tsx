import { useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import gql from 'graphql-tag';
import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import { ME_QUERY } from '../pages/Profile';
import { customStyles } from '../styles/CustomModalStyles';
import { FEED_QUERY } from './Feed';

const CREATE_POST_MUTATION = gql`
  mutation CreateDraft($data: PostCreateInput!) {
    createDraft(data: $data) {
      id
    }
  }
`;

interface PostValues {
  title: string;
  content: string;
  image: string;
}

const CreatePost: React.FC = () => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  const [createPost] = useMutation(CREATE_POST_MUTATION, {
    refetchQueries: [{ query: FEED_QUERY }],
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  const initialValues: PostValues = {
    title: '',
    content: '',
    image: '',
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files![0]);
    data.append('upload_preset', 'printRescue');
    setImageLoading(true);

    const res = await fetch(`https://api.cloudinary.com/v1_1/dowb9pbr7/image/upload`, {
      method: 'POST',
      body: data,
    });
    try {
      const file = await res.json();
      setImageFile(file.secure_url);
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
    }

    setImageLoading(false);
  };

  const onClickHandler = () => {
    if (inputFile.current) {
      const input = inputFile.current as HTMLElement;
      input.click();
    }
  };

  return (
    <div>
      <button style={{ marginRight: '10px', marginTop: '30px' }} onClick={openModal}>
        <span style={{ padding: '15px 70px 15px 70px' }}>Create Post</span>
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <span className="exit" onClick={closeModal}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </span>
        <div className="header"></div>
        <input
          type="file"
          name="file"
          onChange={uploadImage}
          ref={inputFile}
          style={{ display: 'none' }}
        />
        {imageLoading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            {imageFile ? (
              <span>
                <img
                  src={imageFile}
                  style={{ width: '500px' }}
                  alt="avatar"
                  onClick={onClickHandler}
                />
              </span>
            ) : (
              <span>
                <i className="fa fa-user fa-5x" aria-hidden="true" onClick={onClickHandler}></i>
              </span>
            )}
          </>
        )}
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            if (imageFile) {
              setSubmitting(true);
              console.log({ data: { ...values, image: imageFile } });

              try {
                await createPost({
                  variables: { data: { ...values, image: imageFile } },
                });
              } catch (error) {
                console.log(JSON.stringify(error, null, 2));
              }

              setSubmitting(false);
              setIsOpen(false);
            } else {
              alert('You must upload a picture to create a new post!');
            }
          }}
        >
          <Form>
            <Field name="title" type="text" placeholder="Title..." />
            <ErrorMessage name="title" component={'div'} />
            <Field name="content" type="text" as="textarea" placeholder="Describe your print..." />
            <ErrorMessage name="content" component={'div'} />

            <div className="footer"></div>
            <button type="submit" className="tweet-button">
              <span>Tweet</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default CreatePost;
