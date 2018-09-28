import React from 'react';
import { Modal, Header, Segment, Form } from 'semantic-ui-react';
import { SketchPicker } from 'react-color';

class ProjectsFilterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { labels: this.props.labels, pickerForIndex: null };
  }
  render() {
    return (<Segment></Segment>);
  }
}
