import { gql, useMutation, useQuery } from '@apollo/client';
import { ErrorMessage, Field, Formik } from 'formik';
import { useState } from 'react';
import { ME_QUERY } from '../Pages/Profile';
import Modal from 'react-modal';
import { customStyles } from '../styles/CustomModalStyles';

const UPDATE_PROFILE_MUTATION = gql`
  mutation updateProfile($id: Int!, $bio: String, $location: String, $avatar: String) {
    updateProfile(id: $id, bio: $bio, location: $location, avatar: $avatar) {
      id
    }
  }
`;

interface ProfileValues {
  id: number;
  bio: string;
  location: string;
  avatar: string;
}

function UpdateProfile() {
  const { loading, error, data } = useQuery(ME_QUERY);
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);

  const initialValues: ProfileValues = {
    id: data.me.profile.id,
    bio: data.me.profile.bio,
    location: data.me.profile.location,
    avatar: data.me.profile.avatar,
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className="edit-button">
        Update Profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            await updateProfile({
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
                <span>Update Profile</span>
              </button>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
}

export default UpdateProfile;
