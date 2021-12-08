import { Fragment } from 'react';
import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PrintRescueLogo from '../styles/assets/logo.png';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

interface LoginValues {
  email: string;
  password: string;
}

const Login = () => {
  const [login] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();
  const { state } = useLocation();

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email Required'),
    password: Yup.string().max(20, 'Must be 20 characters or less').required('Password Required'),
  });

  return (
    <Fragment>
      <div className="container">
        <img src={PrintRescueLogo} alt="logo" style={{ width: '50px' }} className="logo" />
        <h3>Log in to 3D Print Rescue</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            const response = await login({
              variables: values,
            });

            localStorage.setItem('token', response.data.login.token);
            actions.setSubmitting(false);
            navigate(state.path || '/');
          }}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Field name="email" type="text" placeholder="Email" />
              <ErrorMessage name="email" component={'div'} />
              <Field name="password" type="password" placeholder="Password" />
              <ErrorMessage name="password" component={'div'} />
              <button type="submit" className="login-button">
                <span>Login</span>
              </button>
            </form>
          )}
        </Formik>
        <div className="register">
          <h4>Don't have an account?</h4>
          <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
