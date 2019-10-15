import React, { Component } from "react";
import {
  Container,
  Segment,
  Icon,
  Form,
  Button,
  Dropdown,
  Checkbox
} from "semantic-ui-react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import civic from "../../assets/types/civic.svg";
import science from "../../assets/types/science.svg";
import { addProject } from "../../redux-actions/project";
class ProjectsAddComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showpanel: true,
      values: {
        title: "SteeleLab",
        description: "something",
        full_description: "something else long",
        projectType: '1',
        privateType: false
      }
    };
    this.togglePanel = this.togglePanel.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  resetForm() {
    this.setState({
      values: {
        title: "",
        description: "",
        full_description: "",
        projectType: null,
        privateType: false
      }
    });
  }
  togglePanel() {
    // this.resetForm();
    this.setState({ showpanel: !this.state.showpanel });
  }
  submitForm() {
    console.log("THE FORM", this.state.values);
    const { title, description, full_description, projectType, privateType } = this.state.values;
    if (!title || !description || !full_description || !projectType) {
      return;
    }
    this.props.addProject(this.state.values);
  }
  handleChange(key, value) {
    console.log(value);
    const { values } = this.state;
    values[key] = value;
    this.setState({ values });
  }
  render() {
    const typesOptions = Object.keys(this.props.projectTypes).reduce(
      (acc, key) => {
        const projectType = this.props.projectTypes[key];
        return [
          ...acc,
          {
            key: key,
            text: projectType.name,
            value: key,
            image: {
              avatar: true,
              src: key === "1" || key === "2" ? science : civic
            }
          }
        ];
      },
      []
    );
    return (
      <Container hidden={this.props.auth.loggedIn}>
        <Segment>
          <div
            hidden={!this.state.showpanel}
            onClick={() => this.togglePanel()}
          >
            <Icon name="plus circle" size="big" />
            Add a project
          </div>
          <div hidden={this.state.showpanel} onClick={() => this.togglePanel()}>
            <Icon name="ban" size="big" />
            Hide panel
          </div>
        </Segment>
        <Segment hidden={this.state.showpanel}>
          <Form onSubmit={this.submitForm}>
            <Form.Input
              label="Title"
              type="text"
              value={this.state.values.title}
              onChange={(e, v) => {
                this.handleChange("title", v.value);
              }}
            />
            <Form.Input
              label="Short description"
              type="text"
              value={this.state.values.description}
              onChange={(e, v) => {
                this.handleChange("description", v.value);
              }}
            />
            <Form.Input
              label="Long description"
              type="text"
              value={this.state.values.full_description}
              onChange={(e, v) => {
                this.handleChange("full_description", v.value);
              }}
            />
            <Dropdown
              placeholder="Select project type"
              options={typesOptions}
              fluid
              selection
              value={this.state.values.projectType}
              onChange={(e, v) => {
                this.handleChange("projectType", v.value);
              }}
            />
            <br />
            <Checkbox
              checked={this.state.values.privateType}
              onChange={(e, v) => {
                this.handleChange("privateType", v.checked);
              }}
              label={this.state.values.privateType ? "private" : "public"}
            />{" "}
            <Icon
              name={this.state.values.privateType ? "lock" : "unlock"}
              size="large"
            />
            <br />
            <br />
            <Button type="submit" primary>
              Submit
            </Button>
            <Button
              onClick={() => {
                this.resetForm();
              }}
              secondary
            >
              Reset
            </Button>
          </Form>
        </Segment>
      </Container>
    );
  }
}
function mapStateToProps(state) {
  const { types, auth } = state;
  return {
    projectTypes: types.projectTypes,
    auth
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ addProject }, dispatch);
}

ProjectsAddComponent = connect(
  mapStateToProps,
  matchDispatchToProps
)(ProjectsAddComponent);
export default ProjectsAddComponent;
