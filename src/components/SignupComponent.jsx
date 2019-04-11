import React, { Component } from "react";
import { withFormik } from "formik";
import {
  Card,
  Modal,
  Button,
  Form,
  Grid,
  GridRow,
  Icon,
  Image,
  Input
} from "semantic-ui-react";
import ourlabels from "../assets/ourlabels.png";
import "./SignupComponent.scss";

const SignupForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Form onSubmit={handleSubmit}>
    <Grid textAlign="center">
      <GridRow style={{ width: "100%" }}>
        <Icon name="user circle outline" size="huge" />
      </GridRow>
      <GridRow style={{ width: "100%" }}>
        {window.innerWidth < 500 && (
          <Input
            className="signup-input"
            type="text"
            name="email"
            placeholder="email"
            autoComplete="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
        )}
        {window.innerWidth >= 500 && (
          <Input
            label="Email"
            className="signup-input"
            type="text"
            name="email"
            placeholder="email"
            autoComplete="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
        )}
      </GridRow>
      {touched.email &&
        errors.email && (
        <GridRow>
          <div className="error-label">{errors.email}</div>
        </GridRow>
      )}
      <GridRow style={{ width: "100%" }}>
        {window.innerWidth < 500 && (
          <Input
            className="signup-input"
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
            className="signup-input"
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
      {touched.username &&
        errors.username && (
        <GridRow>
          <div className="error-label">{errors.username}</div>
        </GridRow>
      )}
      <GridRow style={{ width: "100%" }}>
        {window.innerWidth < 500 && (
          <Input
            className="signup-input"
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
            className="signup-input"
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
      {touched.password &&
        errors.password && (
        <GridRow>
          <div className="error-label">{errors.password}</div>
        </GridRow>
      )}
      <GridRow style={{ width: "100%" }}>
        {window.innerWidth < 500 && (
          <Input
            className="signup-input"
            type="password"
            name="retype"
            placeholder="retype password"
            autoComplete="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.retype}
          />
        )}
        {window.innerWidth >= 500 && (
          <Input
            label="Retype Password"
            className="signup-input"
            type="password"
            name="retype"
            placeholder="retype password"
            autoComplete="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.retype}
          />
        )}
      </GridRow>
      {touched.retype &&
        errors.retype && (
        <GridRow>
          <div className="error-label">{errors.retype}</div>
        </GridRow>
      )}
      <GridRow style={{ width: "100%" }}>
        <Button
          className="button-signup"
          type="submit"
          primary
          disabled={isSubmitting}
        >
          Signup
        </Button>
      </GridRow>
    </Grid>
  </Form>
);
const regexpEmail = /^[_A-Za-z0-9-+]+(.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(.[A-Za-z0-9]+)*(.[A-Za-z]{2,})$/;
const FormikSignupForm = withFormik({
  // Transform outer props into form values
  mapPropsToValues: props => ({
    username: "",
    password: "",
    retype: "",
    email: ""
  }),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Required";
    }
    if (!values.password) {
      errors.password = "Required";
    } else if (values.password.length < 16 || values.password.length > 60) {
      errors.password = "Password must be between 16 and 60 characters";
    }
    if (!values.retype) {
      errors.retype = "Required";
    } else if (values.retype !== values.password) {
      errors.retype = "Password and verification must be the same";
    }
    if (!values.email) {
      errors.email = "Required";
    } else if (!regexpEmail.test(values.email)) {
      errors.email = "Email should be of someuser@ourlables.com";
    }
    return errors;
  },
  handleSubmit: (values, props) => {
    props.props.handleSubmit(values.username, values.password, values.email);
  }
})(SignupForm);

class SignupComponent extends Component {
  render() {
    return (
      <div className="signup-holder">
        <Card className="card-signup">
          <Card.Header className="header-signup">
            <Image src={ourlabels} width="30%" />
            <h4 className="signup-header">Signup</h4>
          </Card.Header>
          <Card.Content className="content-signup">
            <FormikSignupForm handleSubmit={this.props.formHandler} />
          </Card.Content>
        </Card>
      </div>
    );
  }
}
export default SignupComponent;
