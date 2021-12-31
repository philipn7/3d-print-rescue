import { gql, useMutation, useQuery } from '@apollo/client';
import { ErrorMessage, Field, Formik } from 'formik';
import { useRef, useState } from 'react';
import { ME_QUERY } from '../pages/Profile';
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

const UpdateProfile: React.FC = () => {
  const inputFile = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

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
      setImage(file.secure_url);
    } catch (error) {
      console.error(error);
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
      <button onClick={openModal} className="edit-button">
        Update Profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        style={customStyles}
      >
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
            {image ? (
              <span>
                <img
                  src={image}
                  style={{ width: '150px', borderRadius: '50%' }}
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
          onSubmit={async (values, actions) => {
            await updateProfile({
              variables: { ...values, avatar: image },
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
};

export default UpdateProfile;
