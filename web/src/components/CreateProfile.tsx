import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Formik } from 'formik';
import { useState } from 'react';
import { ME_QUERY } from '../Pages/Profile';
import Modal from 'react-modal';
import { customStyles } from '../styles/CustomModalStyles';

const CREATE_PROFILE_MUTATION = gql`
  mutation createProfile($bio: String, $location: String, $avatar: String) {
    createProfile(bio: $bio, location: $location, avatar: $avatar) {
      id
    }
  }
`;

interface ProfileValues {
  bio: string;
  location: string;
  avatar: string;
}

function CreateProfile() {
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const initialValues: ProfileValues = {
    bio: '',
    location: '',
    avatar: '',
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Create Profile</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            await createProfile({
              variables: values,
            });

            actions.setSubmitting(false);
            setModalIsOpen(false);
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Field name="bio" type="text" as="textarea" placeholder="Bio" />
              <ErrorMessage name="email" component={'div'} />
              <Field name="location" type="location" placeholder="Location" />
              <ErrorMessage name="location" component={'div'} />
              <button type="submit" className="login-button">
                <span>Create Profile</span>
              </button>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default CreateProfile;
