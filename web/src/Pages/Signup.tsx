import { Fragment } from 'react';
import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import PrintRescueLogo from '../styles/assets/logo.png';

const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

interface SignupValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

const Signup = () => {
  const [signup] = useMutation(SIGNUP_MUTATION);
  let navigate = useNavigate();

  const initialValues: SignupValues = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email Required'),
    password: Yup.string().max(20, 'Must be 20 characters or less').required('Password Required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
    name: Yup.string().max(15, 'Must be 15 characters or less').required('Name Required'),
  });

  return (
    <Fragment>
      <div className="container">
        <img src={PrintRescueLogo} alt="logo" style={{ width: '50px' }} className="logo" />
        <h3>Sign up</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            const response = await signup({
              variables: values,
            });
            console.log(response);

            localStorage.setItem('token', response.data.signup.token);
            actions.setSubmitting(false);
            navigate('/');
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Field name="email" type="text" placeholder="Email" />
              <ErrorMessage name="email" component={'div'} />
              <Field name="name" type="text" placeholder="Name" />
              <ErrorMessage name="name" component={'div'} />
              <Field name="password" type="password" placeholder="Password" />
              <ErrorMessage name="password" component={'div'} />
              <Field name="confirmPassword" type="password" placeholder="Confirm Password" />
              <ErrorMessage name="confirmPassword" component={'div'} />
              <button type="submit" className="login-button">
                <span>Sign up</span>
              </button>
            </form>
          )}
        </Formik>
        <div className="register">
          <h4>Already have an account?</h4>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Signup;
