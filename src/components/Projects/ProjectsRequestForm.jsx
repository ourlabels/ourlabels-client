import React, { Component } from "react";
import { withFormik } from "formik";

const RequestAccessForm = ({
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
        <Icon name="registered" size="huge" />
      </GridRow>
      <GridRow style={{ width: "100%" }}>
        {window.innerWidth < 500 && (
          <Input
            className="signup-input"
            type="text"
            name="requested_project"
            placeholder="requested project"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.requested_project}
          />
        )}
        {window.innerWidth >= 500 && (
          <Input
            label="Requested Project"
            className="signup-input"
            type="text"
            name="requested_project"
            placeholder="requested project"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.requested_project}
          />
        )}
      </GridRow>
      {touched.requested_project &&
        errors.requested_project && (
        <GridRow>
          <div className="error-label">{errors.requested_project}</div>
        </GridRow>
      )}
      <GridRow style={{ width: "100%" }}>
        <Button
          className="group-submit"
          type="submit"
          primary
          disabled={isSubmitting}
        >
          Request Access
        </Button>
      </GridRow>
    </Grid>
  </Form>
);

const FormikRequestAccessForm = withFormik({
  // Transform outer props into form values
  mapPropsToValues: props => ({ requested_project: "" }),
  // Add a custom validation function (this can be async too!)
  validate: (values, props) => {
    const errors = {};
    if (!values.requested_project) {
      errors.requested_project = "Required";
    }
    return errors;
  },
  handleSubmit: (values, props) => {
    props.props.handleSubmit(values.requested_project);
  }
})(RequestAccessForm);
