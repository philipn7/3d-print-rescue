import { useMutation, useQuery } from '@apollo/client';
import { id } from 'date-fns/locale';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import gql from 'graphql-tag';
import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import { ME_QUERY } from '../pages/Profile';
import { customStyles } from '../styles/CustomModalStyles';

const CREATE_TAG_MUTATION = gql`
  mutation CreateTag($id: Int, $name: String) {
    createTag(id: $id, name: $name) {
      id
    }
  }
`;

interface TagValues {
  name: string;
}

interface Props {
  id: number;
}

const CreateTag: React.FC<Props> = ({ id }: Props) => {
  const { loading, error, data } = useQuery(ME_QUERY);
  const [createTag] = useMutation(CREATE_TAG_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const [modalIsOpen, setIsOpen] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) console.log(error.message);

  const initialValues: TagValues = {
    name: '',
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
        <i className="fas fa-plus-circle" aria-hidden="true" />
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
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await createTag({
              variables: { ...values, id },
            });

            setSubmitting(false);
            setIsOpen(false);
          }}
        >
          <Form>
            <Field name="name" type="text" as="textarea" placeholder="New Tag..." />
            <ErrorMessage name="content" component={'div'} />

            <div className="footer" />
            <button type="submit">
              <span>Add Tag</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default CreateTag;
