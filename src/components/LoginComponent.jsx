import React, { Component } from 'react';
import { withFormik } from 'formik';
import {
  Card,
  Button,
  Form,
  Grid,
  GridRow,
  Icon,
  Image,
  Input,
} from 'semantic-ui-react';
import ourlabels from '../assets/ourlabels.png';
import './LoginComponent.scss';

const LoginForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Form onSubmit={handleSubmit}>
    <Grid textAlign="center">
      <GridRow style={{ width: '100%' }}>
        <Icon name="user circle outline" size="huge" />
      </GridRow>
      <GridRow style={{ width: '100%' }}>
        {window.innerWidth < 500 && (
          <Input
            className="login-input"
            type="text"
            name="username"
            placeholder="username"
            autoComplete="username"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
          />
        )}
        {window.innerWidth >= 500 && (
          <Input
            label="Username"
            className="login-input"
            type="text"
            name="username"
            placeholder="username"
            autoComplete="username"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.username}
          />
        )}
      </GridRow>
      {touched.username && errors.username && (
        <GridRow>
          <div className="error-label">{errors.username}</div>
        </GridRow>
      )}
      <GridRow style={{ width: '100%' }}>
        {window.innerWidth < 500 && (
          <Input
            className="login-input"
            type="password"
            name="password"
            placeholder="password"
            autoComplete="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
        )}
        {window.innerWidth >= 500 && (
          <Input
            label="Password"
            className="login-input"
            type="password"
            name="password"
            placeholder="password"
            autoComplete="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
        )}
      </GridRow>
      {touched.password && errors.password && (
        <GridRow>
          <div className="error-label">{errors.password}</div>
        </GridRow>
      )}
      <GridRow style={{ width: '100%' }}>
        <Button
          className="button-login"
          type="submit"
          primary
          disabled={isSubmitting}
        >
          Login
        </Button>
      </GridRow>
    </Grid>
  </Form>
);

const FormikLoginForm = withFormik({
  // Transform outer props into form values
  mapPropsToValues: props => ({ username: '', password: '' }),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 9 || values.password.length > 60) {
      errors.password = 'Password is between 9 and 60 characters';
    }
    return errors;
  },
  handleSubmit: (values, props) => {
    props.props.handleSubmit(values.username, values.password);
  },
})(LoginForm);

class LoginComponent extends Component {
  render() {
    return (
      <div className="login-holder">
        <Card className="card-login">
          <Card.Header className="header-login">
            <Image src={ourlabels} width="30%" />
            <h4 className="login-header">Log in</h4>
          </Card.Header>
          <Card.Content className="content-login">
            <FormikLoginForm handleSubmit={this.props.formHandler} />
          </Card.Content>
        </Card>
      </div>
    );
  }
}
export default LoginComponent;
